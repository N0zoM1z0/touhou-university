const composing = new WeakSet();

export function bindImeSafeInput(control, callback, { debounce = 120 } = {}) {
  if (!(control instanceof HTMLElement)) return;
  let timer;
  const schedule = (event) => {
    window.clearTimeout(timer);
    if (!debounce) {
      callback(event);
      return;
    }
    timer = window.setTimeout(() => callback(event), debounce);
  };
  control.addEventListener("compositionstart", () => composing.add(control));
  control.addEventListener("compositionend", (event) => {
    composing.delete(control);
    schedule(event);
  });
  control.addEventListener("input", (event) => {
    if (event.isComposing || composing.has(control)) return;
    schedule(event);
  });
}

export function isImeComposing(control) {
  return control instanceof HTMLElement && composing.has(control);
}
