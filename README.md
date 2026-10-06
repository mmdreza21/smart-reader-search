# Smart Reader Search

A Progressive Web App for searching a Persian and English text. Type a word or phrase, see every match highlighted, and jump between results with the arrows or the keyboard. It works offline and can be installed on a device.

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

## Features

- Exact, prefix, and phrase search in Persian and English
- All matches highlighted, with an animated active match and smooth scrolling to it
- Autocomplete with the frequency of each word
- Result counter (`3 / 12`) and ▲ ▼ navigation, plus `Enter` / `Shift+Enter`
- Optional whole-word mode
- RTL support, light and dark themes, responsive layout
- Offline support, install button, and an offline indicator
- Accessible: ARIA combobox for suggestions and a live region announcing results

## Tech Stack

React, TypeScript, Vite, Vitest, MiniSearch, Radix UI, and Workbox through `vite-plugin-pwa`.

## Getting Started

```bash
npm install
npm run dev        # start the dev server
npm run build      # type-check and create a production build
npm run test       # run the tests
npm run typecheck  # type-check only
npm run lint       # run ESLint
```

To try offline mode, run `npm run build && npm run preview`, open the app once, then switch the browser DevTools to **Offline** and reload.

## Docker

Build and start the production app with Docker:

```bash
docker build -t smart-reader-search .
docker run --rm -p 8080:80 smart-reader-search
```

Open [http://localhost:8080](http://localhost:8080). The container serves the production build with Nginx. The service worker and manifest are included, so the PWA can be installed and used offline after the first visit. For access from other devices or a production deployment, serve it over HTTPS to meet browser PWA requirements.

## Project Structure

```text
src/
├── core/          # search engine, pure TypeScript with no React
│   ├── normalize.ts, tokenize.ts, index.ts, search.ts
│   ├── autocomplete.ts, splitByMatches.ts, groupRanges.ts
│   └── wrapIndex.ts, scrollDelta.ts, describeResult.ts
├── hooks/         # useSearch, useAutocomplete, useScrollToActive,
│                  # useInstallPrompt, useOnlineStatus
├── components/    # Reader, Paragraph, SearchBar, Suggestions,
│                  # ResultNavigator, SearchOptions, InstallButton, ...
└── data/          # sample-text.ts (the searchable text)
vite.config.ts     # Workbox service worker generation
public/            # manifest and icons
Dockerfile         # multi-stage production image build
nginx.conf         # static hosting, SPA fallback, and PWA cache headers
```

The text to search lives in `src/data/sample-text.ts`. Replace the paragraphs there to search a different text.

## How Search Works

The text is processed once into an index. Every query then runs against that index.

1. **Normalization** makes equivalent spellings equal: `ي`→`ی`, `ك`→`ک`, diacritics, Tatweel, and ZWNJ removed, Persian/Arabic digits turned into English digits, English lowercased.
2. **Tokenization** uses `Intl.Segmenter` to split text into words. Each token keeps `raw`, `norm`, `start`, and `end`. The offsets point into the original text, so highlights land on the right characters even when normalization changes a word's length.
3. **MiniSearch** indexes each paragraph as a document. A frequency map supports autocomplete counts.

```text
   Text:   Solar energy is one of the most important renewable energy sources ...
   Tokens: [0] solar  [1] energy  [2] is  ...  [8] renewable  [9] energy  [10] sources

   energy → [1, 9]
   solar  → [0]
```

4. **Search**
   - One word: MiniSearch finds matching paragraphs, then the tokenizer restores every exact character offset.
   - Several words: MiniSearch narrows candidates by the first word, then adjacent tokens verify the phrase. Every word except the last must match exactly, and the last one is a prefix.
   - Whole-word mode makes the last word match exactly too.
   - Each match has `start` and `end` offsets, which are used for highlighting.

## Performance

The index is built once when the app loads. MiniSearch narrows each query to candidate paragraphs; token checks restore exact offsets and enforce phrase adjacency. Matches are grouped by paragraph, and paragraphs are memoized, so only paragraphs whose highlights changed re-render.

## PWA

- `public/manifest.json` provides the app’s install metadata and icons. An Install button appears when the browser offers an install prompt.
- `vite-plugin-pwa` generates a Workbox service worker that precaches app assets and updates automatically.
- The service worker serves the app shell for navigation while offline and removes outdated caches.
- The generated service worker registration script is included in production builds.

## Testing

Vitest tests cover the logic in `src/core` and the sample text:

- normalization (Persian, Arabic variants, digits, ZWNJ, English)
- tokenizer offsets, MiniSearch paragraph indexing, autocomplete ordering and counts
- exact, prefix, and phrase search, plus overlap and empty-query cases
- highlight splitting, match grouping per paragraph, and autocomplete behavior
- search results on the bilingual sample text

```bash
npm run test
```

## License

Not specified yet.
