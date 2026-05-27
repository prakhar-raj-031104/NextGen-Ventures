// WhatsApp number: replace with your actual WhatsApp business number (country code + number, no +)
const WHATSAPP_NUMBER = "919999999999";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi NextGen Ventures! I'd like to discuss a project."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export const WhatsAppButton = () => (
  <a
    href={WHATSAPP_URL}
    className="whatsapp-fab"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with NextGen Ventures on WhatsApp"
  >
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      width="26"
      height="26"
    >
      <path d="M16 0C7.164 0 0 7.164 0 16c0 2.82.736 5.47 2.027 7.773L0 32l8.432-2.008A15.928 15.928 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm0 29.333a13.27 13.27 0 01-6.773-1.855l-.485-.289-5.006 1.193 1.258-4.866-.317-.5A13.263 13.263 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.273-9.961c-.4-.2-2.364-1.166-2.73-1.299-.367-.133-.633-.2-.9.2-.267.4-1.033 1.299-1.267 1.567-.233.267-.467.3-.867.1-.4-.2-1.687-.622-3.214-1.983-1.188-1.06-1.99-2.369-2.223-2.769-.233-.4-.025-.617.175-.815.18-.18.4-.467.6-.7.2-.233.267-.4.4-.667.133-.267.067-.5-.033-.7-.1-.2-.9-2.167-1.233-2.967-.327-.78-.657-.674-.9-.686l-.767-.013c-.267 0-.7.1-1.067.5s-1.4 1.367-1.4 3.334 1.434 3.867 1.634 4.133c.2.267 2.82 4.3 6.833 6.033.955.413 1.7.66 2.282.845.958.305 1.831.262 2.52.159.769-.115 2.364-.967 2.697-1.9.333-.933.333-1.733.233-1.9-.1-.167-.367-.267-.767-.467z" />
    </svg>
    <span className="whatsapp-fab__label">Chat with us</span>
  </a>
);
