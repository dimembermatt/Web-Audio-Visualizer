//test sandbox for StaticParticleSystem
'use strict';
const modifier = 4.5 / 5;
const cols =  100 * modifier;
const rows =  50 * modifier;
let widthSlice;
let heightSlice;
let pSystem;
let beatFound = false;
let repeated = false;

let context = new (window.AudioContext || window.webkitAudioContext)();
const mastergain = context.createGain();
const analyser = context.createAnalyser();
const analyser2 = context.createAnalyser();
const filter = context.createBiquadFilter();
let src = context.createBufferSource();
// Connect audio nodes form src to dest
src.connect(mastergain);
mastergain.connect(analyser);
mastergain.connect(filter);
filter.connect(analyser2);
analyser.connect(context.destination);

//filter.type = "lowpass";
filter.frequency.value = 225;
filter.gain.value = 10;
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
const waves2 = new Float32Array(analyser2.frequencyBinCount);
analyser.getFloatTimeDomainData(waves);
analyser2.getFloatTimeDomainData(waves2);

function updateWaves() {
    analyser.getFloatTimeDomainData(waves);
    analyser2.getFloatTimeDomainData(waves2);
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'block');

  widthSlice = windowWidth/cols;
  heightSlice = windowHeight/rows;
  pSystem = new ParticleSystem(rows, cols, 2.5, .99);
  round = 0;
}


function draw() {
  background(0);

  pSystem.display(widthSlice, heightSlice);
  pSystem.update();
  if(mouseIsPressed) {
    mousePressed();
  }

  requestAnimationFrame(updateWaves);

  let sum = 0;
  let count = 0;
  noFill();
  beginShape();
  stroke(255,0,0); // waveform is red
  strokeWeight(1.5);
  for (let i = 0; i < waves2.length; i++) {
    sum += waves2[i];
    count ++;
  }
  if (beatFound == false) {
    for (let i = 0; i < waves.length; i++) {
      var x = map(i, 0, waves.length, 0, width);
      var y = map(waves[i], -1, 1, 0, height);
      vertex(x,y);
    }
  }
  endShape();
  let avg = sum/count;
  if (Math.abs(avg) > .013)
    console.log("tap!");
  if (Math.abs(avg) > .015 && repeated == false) {
    if(waves !== null) {
      let peak = 0;
      for (let i = 0; i < waves.length; i++) {
        if (waves[i] > peak) {
          peak = waves[i];
        }
      }
      displayVisual(peak);
    }
    beatFound = true;
    repeated = true;
  }
  else {
    repeated = false;
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

function drawSquare(peak) {
  mousePressed(mouseX + 200, mouseY + 200, peak*250);
  mousePressed(mouseX - 200, mouseY + 200, peak*250);
  mousePressed(mouseX + 200, mouseY - 200, peak*250);
  mousePressed(mouseX - 200, mouseY - 200, peak*250);
}

function drawSquare2(peak) {
  mousePressed(mouseX + 250, mouseY, peak*250);
  mousePressed(mouseX - 250, mouseY, peak*250);
  mousePressed(mouseX, mouseY + 250, peak*250);
  mousePressed(mouseX, mouseY - 250, peak*250);
}

function drawTriangle1(peak) {
  mousePressed(mouseX, mouseY + 200, peak*250);
  mousePressed(mouseX - 130, mouseY - 130, peak*250);
  mousePressed(mouseX + 130, mouseY - 130, peak*250);
}

function drawTriangle2(peak) {
  mousePressed(mouseX, mouseY - 200, peak*250);
  mousePressed(mouseX - 130, mouseY + 130, peak*250);
  mousePressed(mouseX + 130, mouseY + 130, peak*250);
}

// function drawCircle(peak) {
//   for (let i = -4; i < 4; i + 2) {
//     let y = Math.sin(Math.PI/i);
//     let x = Math.cos(Math.PI/i);
//     mousePressed(mouseX + x*20, mouseY + y*20, peak*100);
//   }
// }

function displayVisual(peak) {
  if (peak > .1) {
    //mousePressed(mouseX, mouseY, peak*200);
    //square
    let visual = Math.round(random(0, 3));
    if (visual === 0) {
      drawSquare(peak);
    } else if (visual === 1) {
      drawSquare2(peak);
    } else if (visual === 2) {
      drawTriangle1(peak);
    } else if (visual === 3) {
      drawTriangle2(peak);
    } else;
  }
}
