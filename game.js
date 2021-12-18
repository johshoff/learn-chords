'use strict';

function initGame(onNewChord) {
  var notes = {};
  var chord;
  var lastDisplay = '?';

  function newProblem() {
    let display;
    do {
      chord = randomChord();
      const displays = Array.from(displaysHtml(chord));
      display = randomChoice(displays);
    } while (display == lastDisplay);
    console.log(display);
    onNewChord(display);
    lastDisplay = display;
  }
  newProblem();

  function isEqual(notes, chord) {
    const chord_notes = midiMiddleNotes(chord);
    if (notes.length != chord_notes.length) return false;

    // allow all chord inversions and anywhere on the keyboard
    for (const n of notes) {
      let found = false;
      for (const c of chord_notes) {
        if (n % 12 === c % 12) found = true;
      }
      if (!found) return false;
    }
    return true;
  }
  function checkAnswer() {
    if (isEqual(Object.keys(notes), chord)) {
      newProblem();
    }
  };

  function noteOn(note, velocity) { notes[note] = velocity; checkAnswer(); }
  function noteOff(note) { delete notes[note]; checkAnswer(); }

  return {
    noteOn,
    noteOff,
  };
};
