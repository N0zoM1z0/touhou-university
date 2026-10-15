import { messageRecords } from "../generated/i18n/shell.js";
export { messageRecords };

export const messages = Object.fromEntries(
  ["zh-Hant", "ja", "en"].map((locale, localeIndex) => [
    locale,
    Object.fromEntries(messageRecords.map(([key, ...values]) => [key, values[localeIndex]])),
  ]),
);

export function canonicalText(value) {
  return value
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s*([，。；：！？、])\s*/g, "$1");
}
