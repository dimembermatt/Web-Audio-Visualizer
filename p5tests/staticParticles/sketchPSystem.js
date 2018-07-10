//test sandbox for QuadTree
'use strict';
var modifier = 4.5 / 5;
var cols =  100 * modifier;
var rows =  50 * modifier;
var widthSlice;
var heightSlice;
var pSystem;

function setup() {
  createCanvas(windowWidth, windowHeight);
  widthSlice = windowWidth/cols;
  heightSlice = windowHeight/rows;
  pSystem = new ParticleSystem(rows, cols, 2.5, 1);

  //pSystem.modifyParticleSize(20, 20, 500);
}

function draw() {
  background(0);
  pSystem.display(widthSlice, heightSlice);
  pSystem.update();
  if(mouseIsPressed) {
    mousePressed();
  }
}

function mousePressed() {
  if (mouseY >= 0 && mouseY < height && mouseX >= 0 && mouseX < width) {
    //bounding correction to prevent crash if mouse is at edge of screen
    let x = Math.round(map(mouseY, 0, height, 1, rows-2));
    let y = Math.round(map(mouseX, 0, width, 1, cols-2));
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
          console.log("X:", x, " i:", i);
          console.log("Y:", y, " j:", j);
          pSystem.modifyParticle(x+i, y+j, 50);
      }
    }
  }
}
