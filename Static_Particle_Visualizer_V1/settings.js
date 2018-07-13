/**
 * settings.js
 * Matthew Yu
 * Web-Audio-Visualizer Project (2018)
 * Manages various aspects of the staticPSystem demo.
 * Interactable to the user.
 * Settings panel attributed to the QuickSettings JS library (https://github.com/bit101/quicksettings)
 */

//default setting values
let N = 4;
let baseParticleSize = 6;
let decayRate = .98;
let mouseClickSize = 50;
let fizzBool = true;      //controls whether basePSize * random() occurs
let discoBool = false;     //controls whether random() occurs
let spectrumBool = true;  //controls whether spectrum is shown
let waveWeight = 2.5;
let patternMode = 1;      //controls what patterns are displayed by the visualizer

//function that if settings are adjusted, stop playback, recall setup, and restart playback.
window.onload = function() {
  var settings = QuickSettings.create(5, 25, "Visualizer V1");
  settings.setGlobalChangeHandler(draw);
  settings.addBoolean("Fizzy", fizzBool, function(value) {
    fizzBool = value;
    if (value)
      settings.hideControl("Disco");
    else
      settings.showControl("Disco");
  });
  settings.addBoolean("Disco", discoBool, function(value) {
    discoBool = value;
    if (value)
      settings.hideControl("Fizzy");
    else
      settings.showControl("Fizzy");
  });
  settings.addBoolean("Freq Spectrum", spectrumBool, function(value) {
    spectrumBool = value;
  });
  settings.addRange("Waveform Thickness", 1, 5, waveWeight, .5, function(value) {
    waveWeight = value;
  });
  settings.addRange("Base Particle Size", 4, 10, baseParticleSize, 1, function(value) {
    baseParticleSize = value;
    setup();
  });
  settings.addRange("Visual Size", 20, 100, mouseClickSize, 10, function(value) {
    mouseClickSize = value;
  });
  settings.addRange("Decay Rate", .9, 1, decayRate, .01, function(value) {
    decayRate = value;
    if (decayRate === 1) {
      fizzyBool = false;
      discoBool = false;
      settings.hideControl("Fizzy");
      settings.hideControl("Disco");
    } else {
      settings.showControl("Fizzy");
      settings.showControl("Disco");

    }
    setup();
  });
  settings.addDropDown("Pattern Mode", ["Basic", "Cellular Automata 1"], function(option) {
    patternMode = option.index + 1;
    if (patternMode === 1) {
      settings.showControl("Fizzy");
      settings.showControl("Disco");
      settings.showControl("Base Particle Size");
      settings.showControl("Decay Rate");
    } else if (patternMode === 2) { //if cellular automata 1
      baseParticleSize = 6;
      decayRate = .98;
      settings.hideControl("Fizzy");
      settings.hideControl("Disco");
      settings.hideControl("Base Particle Size");
      settings.hideControl("Decay Rate");
    }
  });
}
