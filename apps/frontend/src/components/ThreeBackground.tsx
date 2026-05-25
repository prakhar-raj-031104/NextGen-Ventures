import { useEffect, useRef } from "react";
import type * as ThreeNamespace from "three";

type ThreeBackgroundProps = {
  variant?: "hero" | "loader";
};

export const ThreeBackground = ({ variant = "hero" }: ThreeBackgroundProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    let disposed = false;
    let cleanupScene: (() => void) | undefined;

    void import("three").then((THREE: typeof ThreeNamespace) => {
      if (disposed) {
        return;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, variant === "loader" ? 7.2 : 8);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance"
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);

      const orange = new THREE.MeshBasicMaterial({
        color: 0xff6a1a,
        wireframe: true,
        transparent: true,
        opacity: variant === "loader" ? 0.75 : 0.55
      });

      const white = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: variant === "loader" ? 0.36 : 0.22
      });

      const amber = new THREE.MeshBasicMaterial({
        color: 0xffa23f,
        wireframe: true,
        transparent: true,
        opacity: 0.38
      });

      const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.28, 0.22, 160, 18), orange);
      knot.position.set(variant === "loader" ? 0 : 2.1, 0.22, 0);
      knot.rotation.set(0.8, 0.4, 0.2);
      group.add(knot);

      const frame = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.1, 0.36, 8, 5, 2), white);
      frame.position.set(
        variant === "loader" ? -1.7 : -2.2,
        variant === "loader" ? -0.8 : 0.15,
        -1.2
      );
      frame.rotation.set(0.15, -0.45, 0.12);
      group.add(frame);

      const torus = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.025, 12, 128), amber);
      torus.position.set(0.25, -0.12, -1.7);
      torus.rotation.set(1.18, 0.2, -0.4);
      group.add(torus);

      const grid = new THREE.GridHelper(10, 20, 0xff6a1a, 0xffffff);
      const gridMaterial = grid.material as ThreeNamespace.Material | ThreeNamespace.Material[];

      if (Array.isArray(gridMaterial)) {
        gridMaterial.forEach((material) => {
          material.transparent = true;
          material.opacity = 0.13;
        });
      } else {
        gridMaterial.transparent = true;
        gridMaterial.opacity = 0.13;
      }

      grid.position.set(0, -2.35, -2.4);
      grid.rotation.x = Math.PI * 0.03;
      group.add(grid);

      const pointer = new THREE.Vector2(0, 0);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const resize = () => {
        const width = Math.max(1, mount.clientWidth);
        const height = Math.max(1, mount.clientHeight);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      const onPointerMove = (event: PointerEvent) => {
        const rect = mount.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * -2;
      };

      let frameId = 0;
      const clock = new THREE.Clock();

      const animate = () => {
        const elapsed = clock.getElapsedTime();
        const speed = variant === "loader" ? 0.68 : 0.36;

        group.rotation.y = elapsed * 0.12 + pointer.x * 0.12;
        group.rotation.x = pointer.y * 0.08;
        knot.rotation.x += 0.004 * speed;
        knot.rotation.y += 0.007 * speed;
        frame.rotation.y -= 0.003 * speed;
        torus.rotation.z += 0.004 * speed;

        renderer.render(scene, camera);

        if (!reducedMotion) {
          frameId = requestAnimationFrame(animate);
        }
      };

      resize();
      mount.addEventListener("pointermove", onPointerMove);
      window.addEventListener("resize", resize);
      animate();

      cleanupScene = () => {
        cancelAnimationFrame(frameId);
        mount.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("resize", resize);
        renderer.dispose();
        knot.geometry.dispose();
        frame.geometry.dispose();
        torus.geometry.dispose();
        orange.dispose();
        white.dispose();
        amber.dispose();

        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      };
    });

    return () => {
      disposed = true;
      cleanupScene?.();
    };
  }, [variant]);

  return <div className={`three-bg three-bg--${variant}`} ref={mountRef} aria-hidden="true" />;
};
