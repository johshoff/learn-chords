'use strict';

function flat(interval) { return '♭' + interval; }

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

function randomKey() {
  // TODO: treat minor as keys here, or leave it to chords?
  const keys = {
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
  const [key, value] = randomChoice(Object.entries(keys));
  return { ...value, name: key };
}

function randomChordPattern() {
  return randomChoice(chord_patterns);
}

function randomChord() {
  const key = randomKey();
  const pattern = randomChordPattern();
  return { key, pattern };
}

function* displaysHtml(chord) {
  // a chord can be displayed in a number of ways. Return all of them.

  const key_name = chord.key.name;

  for (const n of chord.pattern.notation) {
    yield key_name + n;
  }
}

function midiMiddleNotes(chord) {
  // midi notes as if played on or after middle C in midi
  const tonic = chord.key.middle_midi;
  return chord.pattern.notes.integer.map(i => i + tonic);
}

if (console === undefined) {
  // (probably) running in MacOS jsc interpreter
  console = { log: (...args) => debug(Array.prototype.slice.call(args).join(' ')) }
  const chord = randomChord();
  console.log(midiMiddleNotes(chord));
  for (const d of displaysHtml(chord)) console.log(d);
}

