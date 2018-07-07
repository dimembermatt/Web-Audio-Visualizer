//test sandbox for QuadTree
'use strict';
var modifier = 2 / 5;
var cols =  100 * modifier;
var rows =  50 * modifier;
var particles = [];
var boundary;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  boundary = new Rectangle(window.innerWidth/2, window.innerHeight/2,
    window.innerWidth/2, window.innerHeight/2);
  //populate 2d array particles with particle objects
  for (let i = 0; i < cols * rows; i++) {
    particles[i] = new Particle(random(width), random(height), random(3, 15));
  }
}

function draw() {
  background(0);
  //update and display particles
  let qtree = new QuadTree(boundary, 4, 0, 7);
  for (let particle of particles) {
    particle.update();
    particle.show();
    qtree.insert(particle);
  }
  qtree.show();
  //for each particle, identify other nearby particles and display intersecting particles.
  for (let particle of particles) {
    let range = new Rectangle(particle.x, particle.y, 10, 10);
    let others = qtree.query(range);
    for (let other of others) {
      if (particle !== other && range.intersects(other)) {
        stroke(0, 0, 255);
        strokeWeight(6);
        point(particle.x, particle.y);
        let vx = particle.vx;
        let vy = particle.vy;
        particle.transferMomentum(other.vx, other.vy, other.size);
        other.transferMomentum(vx, vy, particle.size);
        stroke(255, 0, 0);
        strokeWeight(1);
        rect(particle.x, particle.y, 30, 30);
      }
    }
  }
  // stroke(0, 255, 0);
  // rectMode(CENTER);
  // let range = new Rectangle(mouseX, mouseY, 100, 100);
  // rect(range.x, range.y, range.w * 2, range.h  * 2);
  // let fParticles = qtree.query(range);
  // for (let p of fParticles) {
  //  stroke(0, 0, 255);
  //  strokeWeight(3);
  //  point(p.x, p.y);
  // }
}
