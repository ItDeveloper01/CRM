/**
 * DestinationSelector.jsx
 * ---------------------------------------------------------------------------
 * Production-ready, reusable destination-tagging control for the Girikand
 * Travel CRM (Holiday Lead Creation screen).
 *
 * The control renders comma/semicolon separated destination names (stored as
 * a single STRING on `holidayLeadObj.requestedDestinations`, backed by
 * `RequestedDestinations NVARCHAR(1000)`) as a single-row, horizontally
 * scrollable strip of pill "chips" with Gmail-style creation/removal
 * behaviour, plus a custom popover that lists every requested destination
 * (useful when chips overflow the visible width).
 *
 * Chips are NEVER stored in local state — they are always derived via
 * useMemo() from `holidayLeadObj.requestedDestinations`, so the string is the
 * single source of truth.
 * ---------------------------------------------------------------------------
 */

// =============================================================================
// IMPORTS
// =============================================================================
import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react';

// =============================================================================
// CONSTANTS
// =============================================================================

/** Only comma and semicolon are valid destination separators. Spaces are NOT. */
const SEPARATOR_REGEX = /[,;]+/;

/** Detects whether raw text currently ends with a separator (possibly with trailing whitespace). */
const TRAILING_SEPARATOR_REGEX = /[,;]\s*$/;

/** How long to wait, after the user stops typing, before auto-committing a chip. */
const DEBOUNCE_MS = 3000;

/** Popover sizing. */
const POPOVER_MAX_HEIGHT = 300;
const POPOVER_WIDTH = 240;
const POPOVER_VIEWPORT_MARGIN = 12;
const MAX_TOTAL_LENGTH = 200;

/** Touch-friendly minimum hit target for the remove ("x") button. */
const REMOVE_BUTTON_SIZE = 32;

/** Unique class used to hide the native scrollbar on the chip strip (cross-browser). */
const SCROLLBAR_HIDE_CLASS = 'ds-scrollbar-hide';

// =============================================================================
// UTILITY FUNCTIONS (pure, framework-agnostic — easy to unit test in isolation)
// =============================================================================

/**
 * Collapses internal whitespace to a single space and strips leading/trailing
 * whitespace. "  New   York  " -> "New York".
 */
const normalizeDestinationName = (raw) => raw.replace(/\s+/g, ' ').trim();

/**
 * Splits a raw string on `,` / `;` (never on spaces), normalizes each token,
 * and drops empty tokens (so `,,`, `;;`, lone `,` / `;` never produce chips).
 */
const parseDestinationTokens = (raw) => {
  if (!raw) return [];
  return raw
    .split(SEPARATOR_REGEX)
    .map(normalizeDestinationName)
    .filter((token) => token.length > 0);
};

/**
 * Merges `newTokens` into `existingChips`, ignoring case-insensitive duplicates.
 * Returns a brand new array (existingChips is never mutated).
 */
const mergeUniqueDestinations = (existingChips, newTokens) => {
  const seenLowerCase = new Set(existingChips.map((c) => c.toLowerCase()));
  const merged = [...existingChips];
  newTokens.forEach((token) => {
    const key = token.toLowerCase();
    if (!seenLowerCase.has(key)) {
      seenLowerCase.add(key);
      merged.push(token);
    }
  });
  return merged;
};

/** Serializes the chip array back into the storage string format. */
const chipsToStorageString = (chips) => chips.join(',');

// =============================================================================
// SMALL INLINE ICONS (kept local — no icon library dependency required)
// =============================================================================

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true">
    <path
      d="M6 6L18 18M18 6L6 18"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
    />
  </svg>
);

const ListIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
    <path
      d="M8 6h12M8 12h12M8 18h12M3.5 6h.01M3.5 12h.01M3.5 18h.01"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);

// =============================================================================
// POPOVER COMPONENT
// Custom (no browser `title` attribute) — hover on desktop, tap on
// tablet/touch, closes on outside-click or Escape, clamped to viewport.
// =============================================================================

const DestinationsPopover = ({ destinations, anchorRef, isOpen, onClose }) => {
  const popoverRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false); // drives the enter transition

  // Position the popover relative to its anchor, clamped inside the viewport.
  useLayoutEffect(() => {
    if (!isOpen || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    let left = rect.right - POPOVER_WIDTH;
    left = Math.max(
      POPOVER_VIEWPORT_MARGIN,
      Math.min(left, window.innerWidth - POPOVER_WIDTH - POPOVER_VIEWPORT_MARGIN)
    );
    const top = Math.min(
      rect.bottom + 8,
      window.innerHeight - POPOVER_VIEWPORT_MARGIN - 40
    );
    setCoords({ top, left });
  }, [isOpen, anchorRef]);

  // Trigger the enter transition one tick after mount.
  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(raf);
    }
    setMounted(false);
    return undefined;
  }, [isOpen]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      const target = event.target;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        anchorRef.current &&
        !anchorRef.current.contains(target)
      ) {
        onClose();
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      role="dialog"
      aria-label="Requested Destinations"
      className={`fixed z-50 rounded-xl border border-slate-200 bg-white shadow-2xl
        transition-all duration-200 ease-out origin-top-right
        ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      style={{ top: coords.top, left: coords.left, width: POPOVER_WIDTH }}
    >

      <ul
        className="py-1.5 overflow-y-auto"
        style={{ maxHeight: `${POPOVER_MAX_HEIGHT}px` }}
      >
        {destinations.length === 0 ? (
          <li className="px-4 py-2 text-sm text-slate-400 italic">No destinations added</li>
        ) : (
          destinations.map((destination, index) => (
            <li
              key={`${destination.toLowerCase()}-${index}`}
              className="px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              {destination}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

// =============================================================================
// CHIP COMPONENT
// =============================================================================

const DestinationChip = ({ label, onRemove, isViewMode, isExiting }) => (
  <span
    className={`inline-flex items-center shrink-0 h-9 max-w-[220px] gap-1
      rounded-full bg-blue-50 pl-3.5 ${isViewMode ? 'pr-3.5' : 'pr-1.5'}
      text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-100
      shadow-sm transition-all duration-200 ease-out
      hover:bg-blue-100 hover:ring-blue-200
      ${isExiting ? 'opacity-0 scale-90 -translate-y-1' : 'opacity-100 scale-100'}
      animate-[chipIn_200ms_ease-out]`}
  >
    <span className="truncate">{label}</span>
    {!isViewMode && (
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        style={{ width: REMOVE_BUTTON_SIZE, height: REMOVE_BUTTON_SIZE }}
        className="flex items-center justify-center rounded-full text-blue-400
          hover:text-blue-700 hover:bg-blue-200/70 active:bg-blue-300/60
          transition-colors duration-150 focus:outline-none focus-visible:ring-2
          focus-visible:ring-blue-400"
      >
        <CloseIcon />
      </button>
    )}
  </span>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const DestinationSelector = ({
  holidayLeadObj = { requestedDestinations: '' },
  setHolidayLeadObj = () => { },
  isViewMode = false,
  error = false,
  onErrorHandle 
}) => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  // The in-progress (uncommitted) text the user is currently typing.
  const [inputValue, setInputValue] = useState('');
  // Whether the input currently has keyboard focus (drives focus ring + scroll).
  const [isFocused, setIsFocused] = useState(false);
  // Whether the "view all" popover is open.
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  // Whether the chip strip currently overflows its visible width.
  const [hasOverflow, setHasOverflow] = useState(false);
  // Tracks a chip mid-removal so we can animate it out before it disappears.
  const [removingChip, setRemovingChip] = useState(null);

  // ---------------------------------------------------------------------------
  // REFS
  // ---------------------------------------------------------------------------
  const inputRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const overflowTriggerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // ---------------------------------------------------------------------------
  // DERIVED VALUES
  // ---------------------------------------------------------------------------
  // Chips are ALWAYS derived from the storage string — never stored in state.
  const chips = useMemo(
    () => parseDestinationTokens(holidayLeadObj?.requestedDestinations),
    [holidayLeadObj?.requestedDestinations]
  );

  const placeholderText = chips.length === 0 ? 'Type destination...' : '';

  const remaining =
    MAX_TOTAL_LENGTH - chips.join(",").length - (chips.length > 0 ? 1 : 0);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  /** Writes a new chip array back to the parent as the single storage string. */
  const commitChips = useCallback(
    (nextChips) => {
      setHolidayLeadObj((prev) => ({
        ...prev,
        requestedDestinations: chipsToStorageString(nextChips),
      }));
    },
    [setHolidayLeadObj]
  );

  /**
   * Parses `rawText`, commits any complete/new tokens as chips, and returns
   * whatever should remain in the live input box.
   *
   * `keepTrailingAsDraft`:
   *   true  -> while actively typing: keep the last (possibly incomplete)
   *            token in the input unless the text ends with a separator.
   *   false -> for blur / debounce-timeout / paste: commit EVERYTHING,
   *            including the trailing token, and clear the input.
   */
  const processRawText = useCallback(
    (rawText, { keepTrailingAsDraft }) => {
      if (!rawText) {
        setInputValue('');
        return;
      }

      const rawParts = rawText.split(SEPARATOR_REGEX);
      const endsWithSeparator = TRAILING_SEPARATOR_REGEX.test(rawText);

      let tokensToCommit = rawParts;
      let draftRemainder = '';

      if (keepTrailingAsDraft && !endsWithSeparator) {
        // Still mid-word on the final segment — leave it in the input.
        draftRemainder = rawParts[rawParts.length - 1];
        tokensToCommit = rawParts.slice(0, -1);
      }

      const cleanedTokens = tokensToCommit
        .map(normalizeDestinationName)
        .filter((token) => token.length > 0);

      if (cleanedTokens.length > 0) {
        const nextChips = mergeUniqueDestinations(chips, cleanedTokens);

        if (nextChips.length !== chips.length) {

          const finalString = chipsToStorageString(nextChips);

          if (finalString.length > MAX_TOTAL_LENGTH) {
            onErrorHandle?.(
              `Requested Destinations cannot exceed ${MAX_TOTAL_LENGTH} characters.`
            );
            return;
          }

          onErrorHandle?.("");
          commitChips(nextChips);
        }
      }

      setInputValue(draftRemainder);
    },
    [chips, commitChips]
  );

  const clearDebounceTimer = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  const handleInputChange = useCallback(
    (event) => {
      const rawText = event.target.value;
      clearDebounceTimer();

      // Immediate commit whenever a separator is present.
      processRawText(rawText, { keepTrailingAsDraft: true });

      // Arm the "pause" debounce so a chip is created even without a
      // separator (e.g. user types "Paris" then simply stops typing).
      debounceTimerRef.current = setTimeout(() => {

        if (inputRef.current) {

          processRawText(inputRef.current.value, {
            keepTrailingAsDraft: false
          });

        }

      }, DEBOUNCE_MS);
    },
    [processRawText, clearDebounceTimer]
  );

  const handleInputBlur = useCallback(() => {
    clearDebounceTimer();
    setIsFocused(false);
    setInputValue((current) => {
      if (current.trim().length === 0) return '';
      processRawText(current, { keepTrailingAsDraft: false });
      return current;
    });
  }, [processRawText, clearDebounceTimer]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputKeyDown = useCallback(
    (event) => {
      // Gmail-style: Backspace on an empty input removes the last chip.
      if (event.key === 'Backspace' && inputValue === '' && chips.length > 0) {
        event.preventDefault();
        const lastChip = chips[chips.length - 1];
        setRemovingChip(lastChip);
        setTimeout(() => {
          commitChips(chips.slice(0, -1));
          setRemovingChip(null);
          inputRef.current?.focus();
        }, 150);
      }
    },
    [inputValue, chips, commitChips]
  );

  const handlePaste = useCallback(
    (event) => {
      event.preventDefault();
      clearDebounceTimer();
      const pastedText = event.clipboardData.getData('text');
      const combinedText = `${inputValue}${pastedText}`;
      // Paste is a discrete, complete action — commit everything at once,
      // even the trailing token, and never leave a partial draft behind.
      processRawText(combinedText, { keepTrailingAsDraft: false });
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [inputValue, processRawText, clearDebounceTimer]
  );

  const handleRemoveChip = useCallback(
    (chipToRemove) => {
      setRemovingChip(chipToRemove);
      setTimeout(() => {
        commitChips(chips.filter((c) => c !== chipToRemove));
        setRemovingChip(null);
        inputRef.current?.focus();
      }, 150);
    },
    [chips, commitChips]
  );

  /** Clicking anywhere in the control (but not on a chip's remove button) focuses the input. */
  const handleContainerClick = useCallback(() => {
    if (!isViewMode) inputRef.current?.focus();
  }, [isViewMode]);

  const openPopover = useCallback(() => setIsPopoverOpen(true), []);
  const togglePopover = useCallback((event) => {
    event.stopPropagation();
    setIsPopoverOpen((open) => !open);
  }, []);
  const closePopover = useCallback(() => setIsPopoverOpen(false), []);

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------

  // Always keep the scroll strip scrolled to the end so the caret / newest
  // chip stays visible (fires on chip changes, typing, and focus).
  useEffect(() => {
    const track = scrollTrackRef.current;
    if (track) track.scrollLeft = track.scrollWidth;
  }, [chips.length, inputValue, isFocused]);

  // Detect whether the chip strip currently overflows, to drive the
  // right-edge fade indicator and the popover's availability.
  useEffect(() => {
    const track = scrollTrackRef.current;
    if (!track) return undefined;

    const measure = () => setHasOverflow(track.scrollWidth > track.clientWidth + 1);
    measure();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure);
      observer.observe(track);
      return () => observer.disconnect();
    }
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [chips.length, inputValue]);

  // Clean up any pending debounce timer on unmount.
  useEffect(() => () => clearDebounceTimer(), [clearDebounceTimer]);

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full">
      {/* Scoped scrollbar-hiding rules (kept local to avoid touching global CSS). */}
      <style>{`
  @keyframes chipIn {
      from {
          opacity: 0;
          transform: scale(0.85) translateY(2px);
      }
      to {
          opacity: 1;
          transform: scale(1) translateY(0);
      }
  }
`}</style>

      <div
        onClick={handleContainerClick}
        onMouseEnter={hasOverflow ? openPopover : undefined}
        className={`relative flex h-10 w-full items-center rounded-xl border
        bg-white pl-3 pr-1 shadow-sm transition-colors duration-150
       ${error
            ? "border-red-500 ring-2 ring-red-100"
            : isFocused
              ? "border-blue-400 ring-2 ring-blue-100"
              : "border-slate-200"
          }
        ${isViewMode ? "bg-slate-50" : "cursor-text hover:border-slate-300"}
    `}
      >
        {/* Single-row, horizontally scrolling chip + input track. Never wraps. */}
        <div
          ref={scrollTrackRef}
          className="flex h-[calc(100%-4px)] flex-1 items-center gap-1.5 overflow-x-auto overflow-y-hidden whitespace-nowrap py-1.5 ds-scrollbar-hide"
        >
          {chips.map((chip) => (
            <DestinationChip
              key={chip.toLowerCase()}
              label={chip}
              isViewMode={isViewMode}
              isExiting={removingChip === chip}
              onRemove={() => handleRemoveChip(chip)}
            />
          ))}

          {/* Edit-mode input always sits right after the last chip. */}
          {!isViewMode && (
            <input
              maxLength={Math.max(0, remaining)}
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              onKeyDown={handleInputKeyDown}
              onPaste={handlePaste}
              placeholder={placeholderText}
              aria-label="Add a requested destination"
              className="
                            h-8
                            w-32
                            shrink-0
                            border-none
                            bg-transparent
                            text-sm
                            focus:outline-none"
            />
          )}
        </div>

        {/* Right-edge fade indicating there is more content off-screen. */}
        {hasOverflow && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-9 top-0 h-full w-8
              bg-gradient-to-r from-transparent to-white"
          />
        )}

        {/* Overflow / "view all" popover trigger — hover (desktop) or tap (touch). */}
        {(hasOverflow || isViewMode) && chips.length > 0 && (
          <button
            ref={overflowTriggerRef}
            type="button"
            onClick={togglePopover}
            onMouseEnter={openPopover}
            aria-label="View all requested destinations"
            aria-haspopup="dialog"
            aria-expanded={isPopoverOpen}
            className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center
              rounded-lg text-slate-400 transition-colors duration-150
              hover:bg-slate-100 hover:text-slate-600 focus:outline-none
              focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <ListIcon />
          </button>
        )}
      </div>

      <DestinationsPopover
        destinations={chips}
        anchorRef={overflowTriggerRef}
        isOpen={isPopoverOpen}
        onClose={closePopover}
      />
    </div>
  );
};

// =============================================================================
// EXPORT
// =============================================================================
export default DestinationSelector;
