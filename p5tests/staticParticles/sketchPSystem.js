/**
 * staticParticleSystem.js
 * Matthew Yu
 * Web-Audio-Visualizer Project (2018)
 * Main runtime body of the StaticPSystem demo.
 */
// Add the audio time domain data
const waves = new Float32Array(analyser.frequencyBinCount);
const spectrum = new Uint8Array(analyser2.frequencyBinCount);
//file scope var
let modifier = N / 5;
let cols =  100 * modifier;
let rows =  50 * modifier;
let widthSlice;   //modifiable on windowResize
let heightSlice;  //modifiable on windowResize
let pSystem;      //particle system

//boolean vars
let repeated = 0;
let count = 0;
let frame = 0;

function setup() {
  let cnv = createCanvas(windowWidth * .9998, windowHeight * .977);
  cnv.style('display', 'block');

  heightSlice = windowHeight/rows;
  widthSlice = windowWidth/cols;
  pSystem = new ParticleSystem(rows, cols, baseParticleSize, decayRate, patternMode);
}

function draw() {
  background(0);
  if(loaded || waves || spectrum) {
    analyser.getFloatTimeDomainData(waves);
    analyser2.getByteFrequencyData(spectrum);

    //display waveform is no current beat
    noFill();
    beginShape();
    stroke(random(0, 255), random(0, 255), random(0, 255));
    strokeWeight(2.5);
    if (!beatFound) {
      for (let i = 0; i < waves.length; i++) {
        var x = map(i, 0, waves.length, 0, width);
        var y = map(waves[i], -1, 1, 200, height - 200);
        vertex(x,y);
      }
    }
    endShape();

    //display spectrum and get moving beat avg
    strokeWeight(4);
		stroke(255, 255, 255);
    let sum = 0;
		let prevPoint;
		let i = 0;
		let xoff = 0;
		while(i < spectrum.length && xoff <= width && spectrumBool === true) {
			let freq  = spectrum[i] + 10;
			point(xoff, freq);
			if(prevPoint) {
				line(prevPoint.x, prevPoint.y, xoff, freq);
			}
			prevPoint = new Point(xoff, freq);
			xoff += 10;
      sum += freq - 10;
			i++;
		}
    let avg = sum/i;

    //update system with visual patterns if beat avg is surpassed
    //console.log(avg);
    if (Math.abs(avg) > 170 && repeated === 0) {
      let peak = 0;
      for (let i = 0; i < waves.length; i++) {
        if (waves[i] > peak) {
          peak = waves[i];
        }
      }
      //if (patternMode === 1)
      displayVisual(peak);

      beatFound = true;
      count = 0;
      repeated = true;
    } else {
      repeated = (repeated + 1) % 6;
      count++;
      if (count > 30)
        beatFound = false;
    }

    //main process - check for mouse input, update system, display
    if(mouseIsPressed) {
      mousePressed(mouseX, mouseY, mouseClickSize);
    }
    if (patternMode === 1) {
      pSystem.update();
    } else if (patternMode === 2) { //fizzBool and discoBool does not work on updateCellularAutomata1
      pSystem.updateCellularAutomata1();
    }
    pSystem.display(widthSlice, heightSlice);
  }
}

//primary "draw" function, draws an arbitrary sized dot in the pSystem
function mousePressed(xCoord = mouseX, yCoord = mouseY, newSize = 50) {
  if (yCoord >= 0 && yCoord < height && xCoord >= 0 && xCoord < width) {
    //bounding correction to prevent crash if mouse is at edge of screen
    let x = Math.round(map(yCoord, 0, height, 1, rows-2));
    let y = Math.round(map(xCoord, 0, width, 1, cols-2));
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        pSystem.modifyParticle(x+i, y+j, newSize, [random(0, 255), random(0, 255), random(0, 255), 200]);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth * .9998, windowHeight * .977);
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

function drawSquare3(peak) {
  mousePressed(width * .15, height * .2, peak*200);
  mousePressed(width * .8, height * .2, peak*200);
  mousePressed(width * .15, height * .8, peak*200);
  mousePressed(width * .8, height * .8, peak*200);
}

function drawSquare4(peak) {
  mousePressed(width * .5, height * .2, peak*200);
  mousePressed(width * .15, height * .5, peak*200);
  mousePressed(width * .5, height * .85, peak*200);
  mousePressed(width * .8, height * .5, peak*200);
}

function drawTriangle1(peak) {
  mousePressed(mouseX, mouseY + 210, peak*200);
  mousePressed(mouseX - 150, mouseY - 130, peak*200);
  mousePressed(mouseX + 150, mouseY - 130, peak*200);
}

function drawTriangle2(peak) {
  mousePressed(mouseX, mouseY - 210, peak*200);
  mousePressed(mouseX - 150, mouseY + 130, peak*200);
  mousePressed(mouseX + 150, mouseY + 130, peak*200);
}

function drawCircle(peak) {
  mousePressed(mouseX, mouseY - 315, peak*200);
  mousePressed(mouseX - 225, mouseY + 195, peak*200);
  mousePressed(mouseX + 225, mouseY + 195, peak*200);
  mousePressed(mouseX, mouseY + 315, peak*200);
  mousePressed(mouseX - 225, mouseY - 195, peak*200);
  mousePressed(mouseX + 225, mouseY - 195, peak*200);
  mousePressed(mouseX - 275, mouseY, peak*200);
  mousePressed(mouseX + 275, mouseY, peak*200);

}

function drawHorizontalLine(peak) {
  mousePressed(mouseX - 300, mouseY, peak*200);
  mousePressed(mouseX - 150, mouseY, peak*200);
  mousePressed(mouseX, mouseY, peak*200);
  mousePressed(mouseX + 150, mouseY, peak*200);
  mousePressed(mouseX + 300, mouseY, peak*200);
}

function drawVerticalLine(peak) {
  mousePressed(mouseX, mouseY - 300, peak*200);
  mousePressed(mouseX, mouseY - 150, peak*200);
  mousePressed(mouseX, mouseY, peak*200);
  mousePressed(mouseX, mouseY + 150, peak*200);
  mousePressed(mouseX, mouseY + 300, peak*200);
}

function drawDiagonalLine1(peak) {
  mousePressed(mouseX - 300, mouseY - 300, peak*200);
  mousePressed(mouseX - 150, mouseY - 150, peak*200);
  mousePressed(mouseX, mouseY, peak*200);
  mousePressed(mouseX + 150, mouseY + 150, peak*200);
  mousePressed(mouseX + 300, mouseY + 300, peak*200);
}

function drawDiagonalLine2(peak) {
  mousePressed(mouseX + 300, mouseY - 300, peak*200);
  mousePressed(mouseX + 150, mouseY - 150, peak*200);
  mousePressed(mouseX, mouseY, peak*200);
  mousePressed(mouseX - 150, mouseY + 150, peak*200);
  mousePressed(mouseX - 300, mouseY + 300, peak*200);
}

function displayVisual(peak) {
  if (peak > .1) {
    //mousePressed(mouseX, mouseY, peak*200);
    //square
    let visual = Math.round(random(0, 10));
    if (visual === 0) {
      drawSquare(peak);
    } else if (visual === 1) {
      drawSquare2(peak);
    } else if (visual === 2) {
      drawTriangle1(peak);
    } else if (visual === 3) {
      drawTriangle2(peak);
    } else if (visual === 4) {
      drawCircle(peak);
    } else if (visual === 5) {
      drawHorizontalLine(peak);
    } else if (visual === 6) {
      drawVerticalLine(peak);
    } else if (visual === 7) {
      drawDiagonalLine1(peak);
    } else if (visual === 8) {
      drawDiagonalLine2(peak);
    } else if (visual === 9) {
      drawSquare3(peak);
    } else if (visual === 10) {
      drawSquare4(peak);
    } else;
  }
}
