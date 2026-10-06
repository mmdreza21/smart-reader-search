import * as Tooltip from "@radix-ui/react-tooltip";
import { useRef } from "react";
import { Reader } from "./components/Reader";
import { ResultAnnouncer } from "./components/ResultAnnouncer";
import { ResultNavigator } from "./components/ResultNavigator";
import { SearchBar } from "./components/SearchBar";
import { SearchOptions } from "./components/SearchOptions";
import { describeResult } from "./core/describeResult";
import { useScrollToActive } from "./hooks/useScrollToActive";
import { useSearch } from "./hooks/useSearch";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { InstallButton } from "./components/InstallButton";

export default function App() {
  const {
    query,
    setQuery,
    wholeWord,
    setWholeWord,
    matches,
    hasQuery,
    activeIndex,
    next,
    prev,
  } = useSearch();
  const headerRef = useRef<HTMLElement>(null);

  useScrollToActive(activeIndex, matches, headerRef);

  return (
    <Tooltip.Provider delayDuration={400}>
      <header ref={headerRef} className="app-header">
        <div className="app-header__top">
          <h1>Smart Reader Search</h1>
          <div className="app-header__status">
            <ConnectionStatus />
            <InstallButton />
          </div>
        </div>
        <div className="app-header__search">
          <SearchBar
            value={query}
            onChange={setQuery}
            onNext={next}
            onPrev={prev}
          />
          {hasQuery && (
            <ResultNavigator
              activeIndex={activeIndex}
              total={matches.length}
              onNext={next}
              onPrev={prev}
            />
          )}
        </div>
        <SearchOptions wholeWord={wholeWord} onWholeWordChange={setWholeWord} />
      </header>
      <main>
        <Reader matches={matches} activeIndex={activeIndex} />
      </main>
      <ResultAnnouncer
        message={describeResult(activeIndex, matches.length, hasQuery)}
      />
    </Tooltip.Provider>
  );
}
