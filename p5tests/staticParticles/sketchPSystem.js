//test sandbox for QuadTree
'use strict';
var modifier = 5 / 5;
var cols =  100 * modifier;
var rows =  50 * modifier;
var widthSlice;
var heightSlice;
var pSystem;

function setup() {
  createCanvas(windowWidth, windowHeight);
  widthSlice = windowWidth/cols;
  heightSlice = windowHeight/rows;
  pSystem = new ParticleSystem(rows, cols, 5);

  pSystem.modifyParticleSize(20, 20, 1000);
}

function draw() {
  background(0);
  pSystem.display(widthSlice, heightSlice);
  pSystem.update();
}

function mousePressed() {
  let y = Math.round(map(mouseX, 0, width, 0, cols));
  let x = Math.round(map(mouseY, 0, height, 0, rows));
  pSystem.modifyParticleSize(x, y, 1000);
}
