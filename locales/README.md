# Three-language editorial catalogs

English (`en`) is the default public edition. Language controls list English,
Japanese (`ja`), then Traditional Chinese (`zh-Hant`), respecting saved choices.
Each edition has matching PO paths, divided
into `shell/`, `data/`, `ui/` and `build/` owners. Use a text editor, Poedit or
another gettext editor. Browser code never reads PO files or calls a translator.

The positional `values()` API remains `(zh-Hant, ja, en)` for existing data
constructors. Its tuple order is independent of the visible language controls.
Prefer keyed records for new consumers.

## Edit existing wording

Find the owning catalog, then edit **msgstr** in the three corresponding files:

```po
#. copy.title
#: src/js/orientation.js:35
msgctxt "tree:copy#/title"
msgid "Bring the admission review, not only the welcome"
msgstr "帶著錄取評議來，別只帶著歡迎詞"
```

This is a format example, not a separate source message. Keep `msgctxt` unchanged:
it connects the editions to the same field. `msgid` provides the English source
reference. Keep whole sentences and paragraphs together. Preserve every named
placeholder, including repeated occurrences, while moving it to the appropriate
position in each language. Translator comments (`#`) and review flags survive
synchronization; source comments (`#.` / `#:`) describe the owning field.

```bash
npm run i18n:sync     # update templates / merge changed English source
npm run build         # compile PO and prepare the complete dist/ publication
npm run check:i18n    # strict catalogs, markup keys and compiled-default checks
npm run preview       # inspect dist/ at http://127.0.0.1:4173
```

English is both the reference edition and the default interface language. When its
`msgstr` changes, sync updates `msgid` and marks the other editions `fuzzy` while
keeping their previous text. Review those translations, update `msgstr`, and
remove the fuzzy flag. Missing or pending translations stop the build; they are
not silently published as another language. Removed messages remain `#~` obsolete
entries and can be restored without losing their previous translation.

Generated POT files are available under `locales/templates/` after sync. They and
`src/generated/i18n/` are ignored build outputs. Keep translator/editor metadata
and notes in the PO source, never in generated JavaScript.

## Add wording

Add an English entry with a stable context and identical `msgid` / `msgstr`, then
run `npm run i18n:sync` and fill the matching Japanese and Traditional Chinese
entries. You can add all three directly when the translations are ready.

Two context families provide the current source interfaces:

| Context | Compiled use |
| --- | --- |
| `text:record.field` | `catalogText("record.field")` → `{ "zh-Hant", ja, en }` |
| `tree:copy#/title` | `catalogTrees["copy"][locale].title` |
| `tree:copy#/rows/0/title` | A nested object/array field of the same locale tree |
| `text:globalKey` in `shell/` | `data-i18n="globalKey"` or `t("globalKey")` |

Tree paths use JSON Pointer escaping: `~1` is `/`, `~0` is `~`. Source references
point to the owner; stable contexts do not depend on file line numbers.

For example, an owning module can import its generated catalog:

```js
import { text as catalogText, trees as catalogTrees } from "../generated/i18n/ui/example.js";

const copy = catalogTrees["copy"];
const notice = catalogText("arrival.confirmed", { name: studentName });
```

Interpolation also accepts per-locale value maps when the inserted value itself
comes from a localized domain record. The generated `values(key)` adapter keeps
existing positional-array consumers working; prefer named locale records for new
data. Domain IDs, routes, thresholds and visitor-authored content remain in code
or their owning store, never in translation catalogs.

The current message API uses singular entries. Unsupported plural directives
fail explicitly; add a dedicated plural API and validation if a future feature
needs grammatical plural selection. The compiler supports UTF-8, multiline
quoted strings, context, notes, flags, previous-source notes and obsolete memory.

## Editorial rules

Natural phrasing should reveal the university's institutions and characters.
Keep consent, uncertainty, provenance, dissent and the practical consequence of a
choice. Do not flatten Aya, Marisa, Yukari or competing faiths into generic helpful
staff. Names, recorded versions and institutional quantities retain their meaning.
Source/editorial distinctions stay in `docs/research/`; ordinary public copy
remains inside Gensokyo.
