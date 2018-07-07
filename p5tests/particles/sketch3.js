//test sandbox for QuadTree
'use strict';
var modifier = 2.5 / 5;
var cols =  100 * modifier;
var rows =  50 * modifier;
var particles = [];
var boundary;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  boundary = new Rectangle(window.innerWidth/2, window.innerHeight/2,
    window.innerWidth/2, window.innerHeight/2);
  particles[0] = new Particle(100, 100, 1, 0);
  particles[1] = new Particle(300, 100, -1, 0);
}

function draw() {
  background(0);
  //update and display particles
  for (let particle of particles) {
    particle.update();
    particle.show();
  }
  //for each particle, identify other nearby particles and display intersecting particles.
  // for (let particle of particles) {
  //   let range = new Rectangle(particle.x, particle.y, 1, 1);
  //   for (let other of particles) {
  //     if (particle !== other && range.intersects(other)) {
  //       stroke(0, 0, 255);
  //       strokeWeight(6);
  //       point(particle.x, particle.y);
  //       let vx = particle.vx;
  //       let vy = particle.vy;
  //       particle.transferMomentum(other.vx, other.vy, other.size);
  //       other.transferMomentum(vx, vy, particle.size);
  //       stroke(255, 0, 0);
  //       strokeWeight(1);
  //       rect(particle.x, particle.y, 30, 30);
  //     }
  //   }
  // }
}
