export function safeDecodeFragment(value = window.location.hash.slice(1)) {
  try {
    return decodeURIComponent(value);
  } catch {
    return "";
  }
}
