import { CSSProperties, ReactNode } from 'react';

const FLAT = '♭'; // ♭
const SHARP = '♯'; // ♯

// The browser default <sup> shrinks text quite aggressively (often ~0.75em)
// — too small to read comfortably in already-small badges. This keeps it
// noticeably raised without shrinking it as much. nowrap keeps a multi-char
// unit like "(9,#11)" or "add" from splitting across a line wrap — it
// should move to the next line as a whole, never break mid-token.
const RAISED_STYLE: CSSProperties = { fontSize: '0.85em', whiteSpace: 'nowrap' };

function Raised({ children }: { children: ReactNode }) {
  return <sup style={RAISED_STYLE}>{children}</sup>;
}

// Degrees that read as extensions/tensions in real chord charts (Cmaj7, C9,
// C♭13, ...) and are conventionally set smaller and raised. Core triad/sus
// tones (1,2,3,4,5) stay on the baseline.
const RAISED_DEGREES = new Set(['6', '7', '9', '10', '11', '13', '14']);

// Suffix words that read as part of the raised extension, same as a tension
// number (e.g. the "sus4" in "7sus4", the "add" in "Majadd(9,#11)").
const RAISED_KEYWORDS = ['sus4', 'add'];

// A parenthesized group counts as a raised suffix if it's either a
// comma-separated tension list, e.g. "(9,#11)", or the "(maj7)" naming
// aside (as in "Min(maj7)") — both read as part of the chord symbol itself,
// glued directly to what precedes them. Anything else in parens — a scale's
// alternate name like "(MM5)" — is a side note: left on the baseline, with
// a leading space to set it apart.
const TENSION_BLOCK_PATTERN = /^\((?:bb|b|#)?\d+(?:,(?:bb|b|#)?\d+)*\)$/;
const MAJ_SEVEN_PAREN_PATTERN = /^\(maj7\)$/;

// Longest alternative first so "bb7" matches the double-flat, not "b" + "b7".
const TOKEN_PATTERN = new RegExp(
  `(\\([^()]*\\))|(bb|b|#)?(\\d+)|(${RAISED_KEYWORDS.join('|')})`,
  'g'
);

const accidentalSymbol = (accidental: string) =>
  accidental === 'bb' ? FLAT + FLAT : accidental === 'b' ? FLAT : accidental === '#' ? SHARP : '';

// Swaps in flat/sharp glyphs without changing size — for text that's
// already raised as a whole block (the tension suffix).
const replaceAccidentals = (text: string) =>
  text.replace(
    /(bb|b|#)(\d+)/g,
    (_, accidental: string, digit: string) => `${accidentalSymbol(accidental)}${digit}`
  );

/**
 * Renders interval/chord-name strings ("b7", "#9", "Min7b5", "Maj7(9,#11)")
 * the way a real chord chart would: flat/sharp glyphs, and — in a full chord
 * symbol or scale name — extensions/tensions raised, except a leading bare
 * "7" (the dominant shorthand, as in "C7" or "7sus4"), which stays on the
 * baseline like the rest of the root. A parenthesized tension suffix is
 * raised as one block, parens included — but a parenthesized annotation
 * that isn't a tension list (a naming aside like "(maj7)", or a scale's
 * alternate name like "(MM5)") stays on the baseline, untouched.
 *
 * Pass `raise: false` for a plain interval list (e.g. inside a tooltip),
 * where only the flat/sharp glyphs matter and nothing should be superscript.
 */
export function formatMusicText(
  text: string,
  { raise = true }: { raise?: boolean } = {}
): ReactNode {
  const nodes: ReactNode[] = [];
  const pattern = new RegExp(TOKEN_PATTERN);
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text))) {
    const [full, paren, accidental = '', degree, keyword] = match;

    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (paren !== undefined) {
      const isTension = TENSION_BLOCK_PATTERN.test(paren);
      const isMajSeven = MAJ_SEVEN_PAREN_PATTERN.test(paren);

      // "(maj7)" glues directly to the root, same as any other extension —
      // everything else (a tension list, or a plain annotation like
      // "(MM5)") gets a leading space, unless the source text already has
      // one (e.g. "Mixolydian b13 (MM5)").
      if (!isMajSeven) {
        const precededBySpace = match.index === 0 || /\s/.test(text[match.index - 1]);
        if (!precededBySpace) nodes.push(' ');
      }

      const content = isTension ? replaceAccidentals(paren) : paren;
      nodes.push(
        raise && (isTension || isMajSeven) ? <Raised key={key++}>{content}</Raised> : content
      );
    } else if (keyword) {
      nodes.push(raise ? <Raised key={key++}>{keyword}</Raised> : keyword);
    } else {
      const symbol = accidentalSymbol(accidental);
      const isLeadingDominantSeven = match.index === 0 && !accidental && degree === '7';
      // An altered 5th (b5/#5) is a color tone same as any other alteration,
      // even though the plain, unaltered 5 stays on the baseline.
      const isAlteredFifth = degree === '5' && !!accidental;

      nodes.push(
        raise && (RAISED_DEGREES.has(degree) || isAlteredFifth) && !isLeadingDominantSeven ? (
          // One string, not two JSX children — two adjacent text nodes are
          // still a valid line-break point, which would let "♯5" split
          // into "♯" / "5" across a wrap.
          <Raised key={key++}>{`${symbol}${degree}`}</Raised>
        ) : (
          `${symbol}${degree}`
        )
      );
    }

    lastIndex = match.index + full.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function MusicText({
  children,
  raise = true,
}: {
  children: string;
  raise?: boolean;
}) {
  // A real element, not a Fragment: this makes MusicText's whole output a
  // single child wherever it's used. Otherwise, in a flex-based label (e.g.
  // Mantine's Button), each piece (text run, <sup>, space) would become its
  // own flex item — breaking normal text behavior in a cascade of ways
  // (whitespace-only items collapsing to zero width, flex items refusing to
  // wrap onto a second line, center-alignment falling apart across wrapped
  // lines). Inside a plain span, it's just ordinary text flow again.
  //
  // minWidth: 0 undoes one more flex default: a flex item's min-width is
  // "auto" (its longest unbreakable run, e.g. "Min(maj7)"), which stops it
  // shrinking below that — so it overflows its box instead of wrapping.
  // Harmless outside a flex context, where min-width: 0 changes nothing.
  return (
    <span style={{ minWidth: 0 }}>{formatMusicText(children, { raise })}</span>
  );
}
