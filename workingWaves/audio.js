/*Script.js - functions for mp3 visualizer using p5.js
Matthew Yu and Ryan Menghani*/
var soundFile;
var isLoaded;

//load DEMO song and title
function setupAudio() {
  soundFormats('ogg', 'mp3');
  soundFile = loadSound('/audio/DEMO_1.mp3');
  fft = new p5.FFT(.95, 64);
  amplitude = new p5.Amplitude();
  return this.buffer
}

function audioLevel() {
	let level = amplitude.getLevel();
	return level;
}

function audioSpectrum() {
  let spectrum = fft.analyze();
  return spectrum;
}

function bassEnergy() {
  return fft.getEnergy("bass");
}

function midEnergy() {
  return fft.getEnergy("mid");
}

function trebleEnergy() {
  return fft.getEnergy("treble");
}

//pause or play when clicking on canvas
function togglePlay() {
  if (soundFile.isPlaying())
    soundFile.pause();
  else
    soundFile.play();
}

//return callback if something is dropped onto canvas
function makeCanvasDroppable(canvas, callback) {
  var e = getElement(canvas.elt.id);
  e.drop(callback);
}

//callback function when recieved dropped file, sets soundFile
function gotFile(file) {
  soundFile.dispose();
  document.getElementById("song_title").innerHTML = "loading...";
  soundFile = loadSound(file, null, displayError(), loading());
  title = "local file";
  document.getElementById("song_title").innerHTML = title;
  togglePlay();
}

//button call function that resets song back to DEMO
function changeSong() {
  soundFile.dispose();
  soundFile = loadSound('audio/DEMO_1.mp3', null, displayError(), loading());
  title = "DEMO_1 - Scars by Papa Roach";
  document.getElementById("song_title").innerHTML = title;
}

//callback function for loadSound
function displayError() {
  document.getElementById("song_title").innerHTML = "an Error has occured.";
}

//callback function for loadSound
function loading(percent) {
  document.getElementById("song_title").innerHTML = "loading..." + (percent * 100) + '%';
}

/**
 * Searches the page for an element with given ID and returns it as
 * a p5.Element. The DOM node itself can be accessed with .elt.
 * Returns null if none found.
 *
 * @method getElement
 * @param  {String} id id of element to search for
 * @return {Object/p5.Element|Null} p5.Element containing node found
 */
p5.prototype.getElement = function (e) {
  var res = document.getElementById(e);
  if (res) {
    return wrapElement(res);
  } else {
    return null;
  }
};
/**
 * Helper function for getElement and getElements.
 */
function wrapElement(elt) {
  if (elt.tagName === "VIDEO" || elt.tagName === "AUDIO") {
    return new p5.MediaElement(elt);
  } else {
    return new p5.Element(elt);
  }
}
