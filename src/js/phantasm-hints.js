import { getLocale } from "./i18n.js";
import { phantasmGateHint } from "./phantasm-gate.js";

export function initPhantasmHints() {
  const root = document.querySelector("[data-phantasm-whisper]");
  if (!root) return;

  const render = () => {
    const hint = phantasmGateHint(getLocale());
    const marks = Array.from({ length: hint.progress.total }, (_, index) =>
      `<i class="${index < hint.progress.count ? "is-visible" : ""}" aria-hidden="true"></i>`).join("");
    root.innerHTML = `
      <span class="phantasm-whisper-marks">${marks}</span>
      ${hint.href
        ? `<a href="${hint.href}">${hint.text}<span aria-hidden="true">↘</span></a>`
        : `<span>${hint.text}</span>`}
    `;
    root.dataset.phantasmTrace = hint.progress.count ? "present" : "quiet";
  };

  window.addEventListener("tu:languagechange", render);
  window.addEventListener("tu:ledgerchange", () => window.requestAnimationFrame(render));
  window.addEventListener("tu:phantasmchange", render);
  window.addEventListener("storage", (event) => {
    if (event.key?.startsWith("tu:")) render();
  });
  render();
}
