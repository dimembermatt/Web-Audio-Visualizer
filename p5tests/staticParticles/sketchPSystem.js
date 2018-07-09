//test sandbox for QuadTree
'use strict';
var modifier = 5 / 5;
var cols =  100 * modifier;
var rows =  50 * modifier;
var widthSlice;
var heightSlice;
var pSystem;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  widthSlice = window.innerWidth/cols;
  heightSlice = window.innerHeight/rows;
  pSystem = new ParticleSystem(cols, rows, 5);

  pSystem.modifyParticleSize(20, 20, 1000);
}

function draw() {
  background(0);
  pSystem.display(widthSlice, heightSlice);
  pSystem.update();
}

function mousePressed() {
  let x = Math.round(map(mouseX, 0, width, 0, cols));
  let y = Math.round(map(mouseY, 0, height, 0, rows));
  pSystem.modifyParticleSize(y, x, 1000);
}
