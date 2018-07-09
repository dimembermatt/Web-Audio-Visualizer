//test sandbox for QuadTree
'use strict';
var modifier = 7 / 5;
var cols =  100 * modifier;
var rows =  50 * modifier;
var widthSlice;
var heightSlice;
var pSystem;

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  widthSlice = windowWidth/cols;
  heightSlice = windowHeight/rows;
  pSystem = new ParticleSystem(rows, cols, 5, 0.995);

  pSystem.modifyParticleSize(20, 20, 500);
}

function draw() {
  background(0);
  pSystem.display(widthSlice, heightSlice);
  pSystem.update();
}

function mousePressed() {
  let x = Math.round(map(mouseY, 0, height, 0, rows));
  let y = Math.round(map(mouseX, 0, width, 0, cols));
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
        pSystem.modifyParticleSize(x+i, y+j, 100);
    }
  }
}
