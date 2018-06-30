/*Script.js - functions for mp3 visualizer using p5.js
Matthew Yu and Ryan Menghani*/

function preload(){
  soundFormats('ogg', 'mp3');
  sound = loadSound('audio/DEMO_1.mp3');
}

function setup(){
  var cnv = createCanvas(window.innerWidth,window.innerHeight);
  cnv.parent('myContainer');
  cnv.mouseClicked(togglePlay);
  fft = new p5.FFT(.95, 1024);
  sound.amp(0.8);
}

function draw(){
  background(0);

  var spectrum = fft.analyze();
  noStroke();
  fill(0,255,0); // spectrum is green
  for (var i = 0; i< spectrum.length; i++){
    var x = map(i, 0, spectrum.length, 0, width);
    var h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h )
  }

  var waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(255,0,0); // waveform is red
  strokeWeight(1.5);
  for (var i = 0; i< waveform.length; i++){
    var x = map(i, 0, waveform.length, 0, width);
    var y = map( waveform[i], -1, 1, 0, height);
    vertex(x,y);
  }
  endShape();

  text('click to play/pause', 4, 10);
}

// fade sound if mouse is over canvas
function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}
