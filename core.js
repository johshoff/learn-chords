'use strict';

const integerForInterval = [Number.NaN,0,2,4,5,7,9,11];
function rel(interval) {
  return (typeof(interval) === 'number')
    ? { name: ''+interval, integer: integerForInterval[interval] }
    : interval;
}
function flat(rawInterval) {
  const interval = rel(rawInterval);
  return {
    name: '♭' + interval.name,
    integer: interval.integer - 1,
  };
}

// also do chord progressions! https://www.jazzguitar.be/blog/diatonic-chords/
// https://mixedinkey.com/captain-plugins/wiki/best-chord-progressions/
const chord_patterns = [
  {
    names: [
      'minor',
    ],
    notation: [
      'm',
    ],
    notes: {
      integer: [0, 3, 7],
      relative: [1, flat(3), 5],
    },
    wikipedia: 'https://en.wikipedia.org/wiki/Minor_chord',
  },
  {
    names: [
      'major',
    ],
    notation: [
      '',
    ],
    notes: {
      integer: [0, 4, 7],
      relative: [1, 3, 5],
    },
    wikipedia: 'https://en.wikipedia.org/wiki/Minor_chord',
  },
  {
    names: [
      'half-diminished seventh',
      'half-diminished',
      'minor seventh flat five',
    ],
    notation: [
      '<sup>ø7</sup>',
      'm<sup>7/♭5</sup>', // garageband
    ],
    notes: {
      integer: [0, 3, 6, 10],
      relative: [1, flat(3), flat(5), flat(7)],
    },
    wikipedia: 'https://en.wikipedia.org/wiki/Half-diminished_seventh_chord',
    mnemonic: 'super mario',
  },
  {
    names: [
      'diminished',
    ],
    notation: [
      'dim',
      '<sup>o</sup>',
    ],
    notes: {
      integer: [0, 3, 6],
      relative: [1, flat(3), flat(5)],
    },
    wikipedia: 'https://en.wikipedia.org/wiki/Diminished_chord',
  },
  {
    names: [
      'diminished seventh',
    ],
    notation: [
      '<sup>o7</sup>',
      'dim<sup>7</sup>',
      'm<sup>6♭5</sup>',
      // accodring to https://en.wikipedia.org/wiki/Diminished_seventh_chord, it is
      // sometimes just 'dim' or '<sup>o</sup>', but can be confused with diminished triad
    ],
    notes: {
      integer: [0, 3, 6, 9],
      relative: [1, flat(3), flat(5), flat(flat(7))],
    },
    wikipedia: 'https://en.wikipedia.org/wiki/Diminished_seventh_chord',
  },
  {
    // what about 9sus4 aka 11
    names: [
      'sus',
      'suspended',
    ],
    notation: [
      'sus2',
      '<sup>sus2</sup>',
    ],
    notes: {
      integer: [0, 2, 7],
      relative: [1, 2, 5],
    },
    wikipedia: 'https://en.wikipedia.org/wiki/Half-diminished_seventh_chord',
  },
];

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomRoot() {
  const roots = {
    'C':  { middle_midi: 60 },
    'C♯': { middle_midi: 61 },
    'D':  { middle_midi: 62 },
    'E♭': { middle_midi: 63 },
    'E':  { middle_midi: 64 },
    'F':  { middle_midi: 65 },
    'F♯': { middle_midi: 66 },
    'G':  { middle_midi: 67 },
    'A♭': { middle_midi: 68 },
    'A':  { middle_midi: 69 },
    'B♭': { middle_midi: 70 },
    'B':  { middle_midi: 71 },
  };
  const [root, value] = randomChoice(Object.entries(roots));
  return { ...value, name: root };
}

function randomChordPattern() {
  return randomChoice(chord_patterns);
}

function randomChord() {
  const root = randomRoot();
  const pattern = randomChordPattern();
  return { root, pattern };
}

function* displaysHtml(chord) {
  // a chord can be displayed in a number of ways. Return all of them.

  const root_name = chord.root.name;

  for (const n of chord.pattern.notation) {
    yield root_name + n;
  }
}

function midiMiddleNotes(chord) {
  // midi notes as if played on or after middle C in midi
  const tonic = chord.root.middle_midi;
  return chord.pattern.notes.integer.map(i => i + tonic);
}

if (console === undefined) {
  // (probably) running in MacOS jsc interpreter
  console = { log: (...args) => debug(Array.prototype.slice.call(args).join(' ')) }
  const chord = randomChord();
  console.log(midiMiddleNotes(chord));
  for (const d of displaysHtml(chord)) console.log(d);

  // do some testing
  function assert(check, msg) {
    if (!check) {
      console.log("Assert failed", msg);
    }
  }

  for (let p of chord_patterns) {
    const n = p.notes;
    assert(n.integer.length === n.relative.length, 'n.integer.length === n.relative.length');
    for (let i in n.integer) {
      assert(n.integer[i] === rel(n.relative[i]).integer, 'n.integer[i] === rel(n.relative[i]).integer');
    }
  }
}

