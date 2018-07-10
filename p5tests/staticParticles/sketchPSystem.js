//test sandbox for QuadTree
'use strict';
var modifier = 4.5 / 5;
var cols =  100 * modifier;
var rows =  50 * modifier;
var widthSlice;
var heightSlice;
var pSystem;
var counter;

function setup() {
  createCanvas(windowWidth, windowHeight);
  widthSlice = windowWidth/cols;
  heightSlice = windowHeight/rows;
  pSystem = new ParticleSystem(rows, cols, 2.5, .99);
  //pSystem.modifyParticleSize(20, 20, 500);
  counter = 0;
}

function draw() {
  background(0);
  pSystem.display(widthSlice, heightSlice);
  pSystem.update();
  if(mouseIsPressed) {
    mousePressed();
  }

  if (counter == 9) {
    mousePressed();
    //square
    mousePressed(mouseX + 150, mouseY + 150);
    mousePressed(mouseX - 150, mouseY + 150);
    mousePressed(mouseX + 150, mouseY - 150);
    mousePressed(mouseX - 150, mouseY - 150);
  }
  counter = (counter + 1)% 10;
}

function mousePressed(xCoord = mouseX, yCoord = mouseY) {
  if (yCoord >= 0 && yCoord < height && xCoord >= 0 && xCoord < width) {
    //bounding correction to prevent crash if mouse is at edge of screen
    let x = Math.round(map(yCoord, 0, height, 1, rows-2));
    let y = Math.round(map(xCoord, 0, width, 1, cols-2));
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        pSystem.modifyParticle(x+i, y+j, 50);
      }
    }
  }
}
