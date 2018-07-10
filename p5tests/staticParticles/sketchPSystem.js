//test sandbox for StaticParticleSystem
'use strict';
var modifier = 4.5 / 5;
var cols =  100 * modifier;
var rows =  50 * modifier;
var widthSlice;
var heightSlice;
var pSystem;

let context = new (window.AudioContext || window.webkitAudioContext)();
const mastergain = context.createGain();
const analyser = context.createAnalyser();
let src = context.createBufferSource();
// Connect audio nodes form src to dest
src.connect(mastergain);
mastergain.connect(analyser);
analyser.connect(context.destination);

// Get the audio src
/*
Might take a while to load audio
*/
let request = new XMLHttpRequest();
request.open('GET', 'DEMO_1.mp3', true);
request.responseType = 'arraybuffer';

request.onload = function() {
    let data = request.response;
    context.decodeAudioData(data, function(buffer){
        src.buffer = buffer;
        src.loop = false;
    }, (e) => console.log("Error with decoding audio data" + e));
}
request.send();
src.start(0);
// Add the audio time domain data
const waves = new Float32Array(analyser.frequencyBinCount);
analyser.getFloatTimeDomainData(waves);

function updateWaves() {
    analyser.getFloatTimeDomainData(waves);
}

function setup() {
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'block');

  widthSlice = windowWidth/cols;
  heightSlice = windowHeight/rows;
  pSystem = new ParticleSystem(rows, cols, 2.5, .99);
  //pSystem.modifyParticleSize(20, 20, 500);
}

function draw() {
  background(0);

  pSystem.display(widthSlice, heightSlice);
  pSystem.update();
  if(mouseIsPressed) {
    mousePressed();
  }

  requestAnimationFrame(updateWaves);
  if(waves !== null) {
    let peak = 0;
    for (let i = 0; i < waves.length; i++) {
      if (waves[i] > peak)
        peak = waves[i]
    }
    console.log(peak);
    mousePressed(mouseX, mouseY, peak*200);
    //square
    mousePressed(mouseX + 200, mouseY + 200, peak*200);
    mousePressed(mouseX - 200, mouseY + 200, peak*200);
    mousePressed(mouseX + 200, mouseY - 200, peak*200);
    mousePressed(mouseX - 200, mouseY - 200, peak*200);
  }
}

function mousePressed(xCoord = mouseX, yCoord = mouseY, newSize = 50) {
  if (yCoord >= 0 && yCoord < height && xCoord >= 0 && xCoord < width) {
    //bounding correction to prevent crash if mouse is at edge of screen
    let x = Math.round(map(yCoord, 0, height, 1, rows-2));
    let y = Math.round(map(xCoord, 0, width, 1, cols-2));
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        pSystem.modifyParticle(x+i, y+j, newSize);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  widthSlice = windowWidth/cols;
  heightSlice = windowHeight/rows;
}
