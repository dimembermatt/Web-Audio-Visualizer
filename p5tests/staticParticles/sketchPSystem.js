//test sandbox for StaticParticleSystem
'use strict';
//constants
const modifier = 4.5 / 5;
const cols =  100 * modifier;
const rows =  50 * modifier;
// Add the audio time domain data
const waves = new Float32Array(analyser.frequencyBinCount);
const spectrum = new Uint8Array(analyser2.frequencyBinCount);
//file scope var
let widthSlice;   //modifiable on windowResize
let heightSlice;  //modifiable on windowResize
let pSystem;      //particle system

//boolean vars

let repeated = 0;

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

function setup() {
  let cnv = createCanvas(windowWidth * .9998, windowHeight * .977);
  cnv.style('display', 'block');

  widthSlice = windowWidth/cols;
  heightSlice = windowHeight/rows;
  pSystem = new ParticleSystem(rows, cols, 2.5, .98);
}

let count = 0;
function draw() {
  background(0);
  if(loaded || waves || spectrum) {
    analyser.getFloatTimeDomainData(waves);
    analyser2.getByteFrequencyData(spectrum);

    noFill();
    beginShape();
    stroke(random(0, 255), random(0, 255), random(0, 255)); // waveform is red
    strokeWeight(1.5);
    if (!beatFound) {
      for (let i = 0; i < waves.length; i++) {
        var x = map(i, 0, waves.length, 0, width);
        var y = map(waves[i], -1, 1, 200, height - 200);
        vertex(x,y);
      }
    }
    endShape();


    pSystem.update();
    if(mouseIsPressed) {
      mousePressed();
    }

    strokeWeight(4);
		stroke(255, 255, 255);
    let sum = 0;
		let prevPoint;
		let i = 0;
		let xoff = 0;
		while(i < spectrum.length && xoff <= width) {
			let freq  = spectrum[i] + 20;
			point(xoff, freq);
			if(prevPoint) {
				line(prevPoint.x, prevPoint.y, xoff, freq);
			}
			prevPoint = new Point(xoff, freq);
			xoff += 10;
      sum += freq - 20;
			i++;
		}


    pSystem.display(widthSlice, heightSlice);


    let avg = sum/i;
    console.log(avg);
    if (Math.abs(avg) > 184)
      console.log("tap!");
    if (Math.abs(avg) > 184 && repeated === 0) {
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
      count = 0;
      repeated = true;
    }
    else {
      repeated = (repeated + 1) % 6;
      count ++;
      if (count > 25)
        beatFound = false;
    }

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
  mousePressed(mouseX + 200, mouseY + 200, peak*200);
  mousePressed(mouseX - 200, mouseY + 200, peak*200);
  mousePressed(mouseX + 200, mouseY - 200, peak*200);
  mousePressed(mouseX - 200, mouseY - 200, peak*200);
}

function drawSquare2(peak) {
  mousePressed(mouseX + 250, mouseY, peak*200);
  mousePressed(mouseX - 250, mouseY, peak*200);
  mousePressed(mouseX, mouseY + 250, peak*200);
  mousePressed(mouseX, mouseY - 250, peak*200);
}

function drawTriangle1(peak) {
  mousePressed(mouseX, mouseY + 210, peak*200);
  mousePressed(mouseX - 130, mouseY - 130, peak*200);
  mousePressed(mouseX + 130, mouseY - 130, peak*200);
}

function drawTriangle2(peak) {
  mousePressed(mouseX, mouseY - 210, peak*200);
  mousePressed(mouseX - 130, mouseY + 130, peak*200);
  mousePressed(mouseX + 130, mouseY + 130, peak*200);
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
