/**
 * settings.js
 * Matthew Yu
 * Web-Audio-Visualizer Project (2018)
 * Manages various aspects of the staticPSystem demo.
 * Interactable to the user.
 */

//default setting values
let N = 4;
let baseParticleSize = 6;
let decayRate = .98;
let mouseClickSize = 50;
let fizzBool = true;      //controls whether basePSize * random() occurs
let discoBool = false;     //controls whether random() occurs
let spectrumBool = true;  //controls whether spectrum is shown
let patternMode = 1;      //controls what patterns are displayed by the visualizer

//function that if settings are adjusted, stop playback, recall setup, and restart playback.
