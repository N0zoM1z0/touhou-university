const dialog = document.querySelector("[data-info-dialog]");
let actionHandler = null;

export function openInfoDialog({
  kicker,
  title,
  summary,
  image = null,
  imageAlt = "",
  meta = [],
  action = null,
}) {
  if (!dialog) return;
  const media = dialog.querySelector("[data-info-media]");
  const imageElement = dialog.querySelector("[data-info-image]");
  dialog.querySelector("[data-info-kicker]").textContent = kicker;
  dialog.querySelector("[data-info-title]").textContent = title;
  dialog.querySelector("[data-info-summary]").textContent = summary;

  media.hidden = !image;
  if (image) {
    imageElement.src = image;
    imageElement.alt = imageAlt;
  } else {
    imageElement.removeAttribute("src");
    imageElement.alt = "";
  }

  const metaList = dialog.querySelector("[data-info-meta]");
  metaList.replaceChildren();
  for (let index = 0; index < meta.length; index += 2) {
    const wrapper = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = meta[index];
    description.textContent = meta[index + 1] || "";
    wrapper.append(term, description);
    metaList.append(wrapper);
  }

  const actionButton = dialog.querySelector("[data-info-action]");
  actionHandler = action?.handler || null;
  actionButton.hidden = !action;
  if (action) dialog.querySelector("[data-info-action-label]").textContent = action.label;
  if (!dialog.open) dialog.showModal();
}

export function closeInfoDialog() {
  if (dialog?.open) dialog.close();
}

export function initInfoDialog() {
  dialog?.querySelector("[data-info-close]")?.addEventListener("click", closeInfoDialog);
  dialog?.querySelector("[data-info-action]")?.addEventListener("click", () => actionHandler?.());
}
