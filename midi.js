'use strict';

function initMidi(noteOn, noteOff) {
  const MIDI_NOTE_ON = 144;
  const MIDI_NOTE_OFF = 128;

  if (navigator.requestMIDIAccess) {
    console.log('This browser supports WebMIDI!');
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  } else {
    console.log('WebMIDI is not supported in this browser.');
  }

  function onMIDISuccess(midiAccess) {
    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;

    for (var input of midiAccess.inputs.values()) {
      input.onmidimessage = getMIDIMessage;
    }
  }

  function onMIDIFailure() {
    console.log('Error: Could not access MIDI devices. Connect a device and refresh to try again.');
  }

  function getMIDIMessage(message) {
    //console.log(message);
    var command = message.data[0];
    var note = message.data[1];

    switch (command) {
      case MIDI_NOTE_ON:
        var velocity = message.data[2];
        if (velocity > 0) {
          noteOn(note, velocity);
        } else {
          noteOff(note);
        }
        break;
      case MIDI_NOTE_OFF:
        noteOff(note);
        break;
    }
  }
}
