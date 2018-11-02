/**
 * space_visualizer.js
 * Matthew Yu
 * Web-Audio-Visualizer Project (2018)
 * Main runtime body of the Space_Visualizer demo
 */
'use strict';
//file scope var
let connections = 32768/80; //about 400 particles
let particles = [];
let boundary;
let width;
let height;

function setup() {
  width =  window.innerWidth * .9998;
  height = window.innerHeight * .993;
  var cnv = createCanvas(width, height);
  cnv.style('display', 'block');
  //cnv.parent('sky');
  boundary = new Rectangle(width/2, height/2,
    width/2, height/2);
  //populate 2d array particles with particle objects
  let angle = 0;
  let radius = 100;
  for (let i = 0; i < connections; i++) {
    let size;
    if(random(0, 10) > 8) {
      size = random(15, 40);
    } else {
      size = random(5, 15);
    }
    let x = Math.cos(angle) * radius + width/2;
    let y = Math.sin(angle) * radius + height/2;
    particles[i] = new Particle(x, y, size, 20);
    angle += Math.PI/10;
    if (angle === (Math.PI * 2)) {
      radius += 50;
      angle = 0;
    }
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
  //for each particle, identify those that are close and create connections
  for (let particle of particles) {
    let range = new Rectangle(particle.x, particle.y, 30, 30);
    let others = qtree.query(range);
    for (let i = 0; i < others.length; i++) {
      let particleB = others[i];
      if (particle !== particleB && particle.pIntersect(particleB)) {
        //elastic collision if particles have not collided before
        if (particle.colliding == false && particleB.colliding == false) {
          particle.storeVelocities();
          particleB.storeVelocities();
          //particle.elasticCollision(particleB);
          //particleB.elasticCollision(particle);
          particle.colliding = true;
          particleB.colliding = true;
        }
      }
      else {//colliding state is now false when not in range of another particle
        particle.colliding = false;
        particleB.colliding = false;
        //draw connection based on distance
        let dst = 10/Math.sqrt(Math.pow(particle.x - particleB.x, 2) + Math.pow(particle.y - particleB.y, 2));
        console.log(dst);
        strokeWeight(dst);
        stroke(255);
        line(particle.x, particle.y, particleB.x, particleB.y);
        //draw bounding box
        //stroke(255, 0, 0);
        //strokeWeight(1);
        //rect(particle.x, particle.y, 50, 50);
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
