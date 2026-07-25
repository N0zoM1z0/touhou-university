let cleanupTimer = 0;
let activeCleanup = null;

function removePrintRoot() {
  window.clearTimeout(cleanupTimer);
  activeCleanup?.();
  activeCleanup = null;
}

export function printDocument(source, { title = document.title } = {}) {
  const content = typeof source === "string" ? document.querySelector(source) : source;
  if (!content || !content.textContent.trim()) return false;

  removePrintRoot();
  const previousTitle = document.title;
  const root = document.createElement("div");
  root.className = "tu-print-root";
  root.dataset.tuPrintRoot = "";
  root.setAttribute("role", "document");
  root.append(content.cloneNode(true));
  root.querySelectorAll("button, [data-print-exclude]").forEach((element) => element.remove());
  document.body.append(root);
  document.body.classList.add("tu-document-printing");
  document.title = title;

  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    document.body.classList.remove("tu-document-printing");
    root.remove();
    document.title = previousTitle;
    window.removeEventListener("afterprint", cleanup);
    if (activeCleanup === cleanup) activeCleanup = null;
  };
  activeCleanup = cleanup;
  window.addEventListener("afterprint", cleanup, { once: true });
  cleanupTimer = window.setTimeout(cleanup, 60_000);

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => window.print());
  });
  return true;
}

