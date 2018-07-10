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
  pSystem = new ParticleSystem(rows, cols, 2.5, .9999);

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
  let x = Math.round(map(mouseY, 0, height, 0, rows));
  let y = Math.round(map(mouseX, 0, width, 0, cols));
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
        pSystem.modifyParticle(x+i, y+j, 50);
    }
  }
}
