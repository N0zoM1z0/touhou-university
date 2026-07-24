const restoreTokens = new WeakMap();

function focusRecord(root) {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement) || !root.contains(active)) return null;
  const key = active.dataset.preserveFocus;
  if (!key) return null;
  const record = { key };
  if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
    record.selectionStart = active.selectionStart;
    record.selectionEnd = active.selectionEnd;
  }
  return record;
}

export function captureRenderState(root, { preserveWindow = false } = {}) {
  if (!(root instanceof Element)) return null;
  const scrollElements = [
    ...(root.matches("[data-preserve-scroll]") ? [root] : []),
    ...root.querySelectorAll("[data-preserve-scroll]"),
  ];
  return {
    window: preserveWindow ? { x: window.scrollX, y: window.scrollY } : null,
    scroll: scrollElements.map((element) => ({
      key: element.dataset.preserveScroll,
      top: element.scrollTop,
      left: element.scrollLeft,
    })).filter((record) => record.key),
    focus: focusRecord(root),
  };
}

export function restoreRenderState(root, snapshot) {
  if (!(root instanceof Element) || !snapshot) return;
  const token = (restoreTokens.get(root) || 0) + 1;
  restoreTokens.set(root, token);
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      if (restoreTokens.get(root) !== token || !root.isConnected) return;
      for (const record of snapshot.scroll) {
        const element = [
          ...(root.matches("[data-preserve-scroll]") ? [root] : []),
          ...root.querySelectorAll("[data-preserve-scroll]"),
        ]
          .find((candidate) => candidate.dataset.preserveScroll === record.key);
        if (!element) continue;
        element.scrollTop = record.top;
        element.scrollLeft = record.left;
      }
      if (snapshot.window) {
        const previous = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(snapshot.window.x, snapshot.window.y);
        document.documentElement.style.scrollBehavior = previous;
      }
      if (snapshot.focus) {
        const target = [...root.querySelectorAll("[data-preserve-focus]")]
          .find((candidate) => candidate.dataset.preserveFocus === snapshot.focus.key);
        if (target instanceof HTMLElement) {
          target.focus({ preventScroll: true });
          if (
            (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
            && Number.isInteger(snapshot.focus.selectionStart)
            && Number.isInteger(snapshot.focus.selectionEnd)
          ) {
            target.setSelectionRange(snapshot.focus.selectionStart, snapshot.focus.selectionEnd);
          }
        }
      }
    });
  });
}

export function renderPreservingState(root, render, options) {
  const snapshot = captureRenderState(root, options);
  const result = render();
  restoreRenderState(root, snapshot);
  return result;
}

export function mutateAndRenderPreservingState(root, mutate, render, options) {
  const snapshot = captureRenderState(root, options);
  const result = mutate?.();
  if (result === false) return result;
  render();
  restoreRenderState(root, snapshot);
  return result;
}
