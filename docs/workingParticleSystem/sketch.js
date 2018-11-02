//test sandbox for QuadTree
'use strict';
let modifier = 3 / 5;
let cols =  100 * modifier;
let rows =  50 * modifier;
let particles = [];
let boundary;
let width;
let height;

function setup() {
  width =  window.innerWidth * .9998;
  height = window.innerHeight * .995;
  var cnv = createCanvas(width, height);
  cnv.parent('universe');
  boundary = new Rectangle(width/2, height/2,
    width/2, height/2);
  //populate 2d array particles with particle objects

  for (let i = 0; i < cols * rows; i++) {
    particles[i] = new Particle(random(width), random(height), random(5, 12), 5);
  }
}

function draw() {
  background(0);
  //update and display particles
  let qtree = new QuadTree(boundary, 4, 0, 10);

  for (let particle of particles) {
    particle.update();
    particle.show();
    qtree.insert(particle);
  }
  //qtree.show();
  //for each particle, identify other nearby particles and display intersecting particles.
  for (let particle of particles) {
    let range = new Rectangle(particle.x, particle.y, particle.size, particle.size);
    let others = qtree.query(range);
    for (let i = 0; i < others.length; i++) {
      let particleB = others[i];
      if (particle !== particleB && particle.pIntersect(particleB)) {
        stroke(0, 0, 255);
        strokeWeight(6);
        //point(particle.x, particle.y);
        //point(particleB.x, particleB.y);

        //elastic collision if particles have not collided before
        if (particle.colliding == false && particleB.colliding == false) {
          particle.storeVelocities();
          particleB.storeVelocities();
          particle.elasticCollision(particleB);
          particleB.elasticCollision(particle);
          particle.colliding = true;
          particleB.colliding = true;
        }

        //draw bounding box
        stroke(255, 0, 0);
        strokeWeight(1);
        //rect(particle.x, particle.y, 30, 30);
      }
      else {//colliding state is now false when not in range of another particle
        particle.colliding = false;
        particleB.colliding = false;
      }
    }
  }
}

function windowResized() {
  width =  window.innerWidth * .9998;
  height = window.innerHeight * .977;
  resizeCanvas(width, height);
  boundary = new Rectangle(width/2, height/2,
    width/2, height/2);
}
