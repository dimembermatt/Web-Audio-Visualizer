/*Script.js - functions for mp3 visualizer using p5.js
Matthew Yu and Ryan Menghani*/
var soundFile;
var isLoaded;

//load DEMO song and title
function preload() {
  soundFormats('ogg', 'mp3');
  soundFile = loadSound('audio/DEMO_1.mp3');
  title = "DEMO_1 - Scars by Papa Roach";
  document.getElementById("song_title").innerHTML = title;
}

function setup() {
  var cnv = createCanvas(window.innerWidth * .9, window.innerHeight * .75);
  cnv.parent('myContainer');
  cnv.mouseClicked(togglePlay);
  noStroke();
  makeCanvasDroppable(cnv, gotFile);
  fft = new p5.FFT(.95, 64);
  amplitude = new p5.Amplitude();
}

//mainLoop
function draw() {
  background(0);

  var level = amplitude.getLevel();
  //document.getElementById("song_title").innerHTML = level;
  var size = map(level, 0, .5, 0, 400);
  ellipse(width/2, height/2, size, size);

  var spectrum = fft.analyze();
  fill(0,255,0); // spectrum is green
  for (var i = 0; i< spectrum.length; i++) {
    var x = map(i, 0, spectrum.length, 0, width);
    var h = -height + map(spectrum[i], 0, 255, height, 60);
    rect(x, height, width / spectrum.length, h );
  }
  for(var i = 0; i< 64; i++) {
    text(i, i*25 + 2, 25);
    text(spectrum[i], i*25 + 2, 50);
  }

  var waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(255,0,0); // waveform is red
  strokeWeight(1.5);
  for (var i = 0; i< waveform.length; i++) {
    var x = map(i, 0, waveform.length, 0, width);
    var y = map(waveform[i], -1, 1, 0, height);
    vertex(x,y);
  }
  endShape();

  var bassFreq = fft.getEnergy("bass");
  noFill();
  beginShape();
  stroke(0,0,255);
  strokeWeight(2);
  for (var i = 0; i< bassFreq.length; i++) {
    var x = map(i, 0, bassFreq.length, 0, width);
    var y = map(bassFreq[i], 0, 255, 0, height);
    vertex(x,y);
  }
  endShape();
  text('click to play/pause', 4, 10);
}







//pause or play when clicking on canvas
function togglePlay() {
  if (soundFile.isPlaying()) {
    soundFile.pause();
  } else {
    soundFile.play();
  }
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