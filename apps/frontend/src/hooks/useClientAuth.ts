import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import type { ClientAccount, LoginPayload, RegisterPayload } from "../types";

const TOKEN_KEY = "ngv_portal_token";
const ACCOUNT_KEY = "ngv_portal_account";

const readStored = (): { token: string | null; account: ClientAccount | null } => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(ACCOUNT_KEY);
    return { token, account: raw ? (JSON.parse(raw) as ClientAccount) : null };
  } catch {
    return { token: null, account: null };
  }
};

export interface ClientAuth {
  token: string | null;
  account: ClientAccount | null;
  loading: boolean;
  /** Returns the one-time generated password to display to the client. */
  register: (payload: RegisterPayload) => Promise<string | undefined>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

export function useClientAuth(): ClientAuth {
  const initial = readStored();
  const [token, setToken] = useState<string | null>(initial.token);
  const [account, setAccount] = useState<ClientAccount | null>(initial.account);
  const [loading, setLoading] = useState<boolean>(Boolean(initial.token));

  const persist = useCallback((nextToken: string, nextAccount: ClientAccount) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(nextAccount));
    setToken(nextToken);
    setAccount(nextAccount);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ACCOUNT_KEY);
    setToken(null);
    setAccount(null);
  }, []);

  // Validate an existing token on first load; drop it if the session is dead.
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    api
      .getMe(token)
      .then((fresh) => {
        if (cancelled) return;
        setAccount(fresh);
        localStorage.setItem(ACCOUNT_KEY, JSON.stringify(fresh));
      })
      .catch(() => {
        if (!cancelled) logout();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const res = await api.register(payload);
      persist(res.data.token, res.data.account);
      return res.data.password;
    },
    [persist]
  );

  const login = useCallback(
    async (payload: LoginPayload) => {
      const res = await api.login(payload);
      persist(res.data.token, res.data.account);
    },
    [persist]
  );

  return { token, account, loading, register, login, logout };
}
