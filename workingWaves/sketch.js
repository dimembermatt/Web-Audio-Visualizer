var balls = [];

var liquid; 

var img;

var children;
var bass;
var mids;
var treble;



var sectionMap;

//PARTICLE CLASS ================================================================================================

function Particle (position, velocity, orientation) {
	this.position = position;
	this.velocity = velocity;
	this.orientation = orientation;
}



//LIQUID CLASS ================================================================================================


function Liquid(s) {
	this.springs = s;
	this.tension = 0.025;
	this.dampening = 0.025;
	this.spread = 0.25;
	this.scale = (width / this.springs.length)+1;
	this.particles = [];
};

function Spring() {
	this.targetHeight = 0;
	this.height = 0;
	this.vel = 0;

	this.update = function(dampening, tension) {
		let x = this.targetHeight - this.height;
		this.vel += (tension * x - this.vel * dampening);
		this.height += this.vel;
	}
};

// particle methods
Liquid.prototype.getHeight = function(x) {
	if (x < 0 || x > width)
		return height/2;
	
	
	return this.springs[Math.trunc(x / this.springs.length)].height;
}

Liquid.prototype.updateParticle = function(particle) {
	gravity = 0.3;
	particle.velocity.y += gravity;
	particle.position.add(particle.velocity);
	particle.orientation = this.getAngle(particle.velocity);
};

Liquid.prototype.getAngle = function(vector) {
	return Math.atan2(vector.y, vector.x);
}


Liquid.prototype.drawParticle = function(particle) {
	noStroke();
	fill(0, 0, 255)
	ellipse(particle.position.x, particle.position.y, 5, 5);
}

Liquid.prototype.draw = function() {
	for (var i = 0; i < this.particles.length; i++) {
		this.drawParticle(this.particles[i]);
	}
}

Liquid.prototype.createSplashParticles = function(xPos, speed) {
	y = this.getHeight(xPos);

	if(speed > 0) {
		for (var i = 0; i < Math.trunc(speed/8); i++) {
			pos = createVector(xPos, y);
			pos.add(this.getRandomVector(40));
			vel = this.fromPolar(this.getRandomFloat(-150, -30), this.getRandomFloat(0, 0.5 * Math.sqrt(speed)));
            this.particles.push(new Particle(pos, vel, 0));
		}
	}
}

Liquid.prototype.fromPolar = function(angle, magnitude) {
	vector = createVector(Math.cos(angle), Math.sin(angle));
	vector.mult(magnitude);
	return vector;
}

Liquid.prototype.getRandomFloat = function(min, max) {
	return random(min, max);
}

Liquid.prototype.getRandomVector = function(maxLength) {
	return this.fromPolar(this.getRandomFloat(-PI, PI), this.getRandomFloat(0, maxLength));
}

Liquid.prototype.update = function () {

	for (var i = 0; i < this.springs.length; i++)
		this.springs[i].update(this.dampening, this.tension);

	var lDeltas = [];
	var rDeltas = [];
	
	// do some passes where columns pull on their neighbours
	for (var j = 0; j < 6; j++) {
		for (var i = 0; i < this.springs.length; i++) {
			if (i > 0) {
				lDeltas[i] = this.spread * (this.springs[i].height - this.springs[i - 1].height);
				this.springs[i - 1].vel += lDeltas[i];
			}
			if (i < this.springs.length - 1) {
				rDeltas[i] = this.spread * (this.springs[i].height - this.springs[i + 1].height);
				this.springs[i + 1].vel += rDeltas[i];
			}
		}

		for (var i = 0; i < this.springs.length; i++) {
			if (i > 0)
				this.springs[i - 1].height += lDeltas[i];
			if (i < this.springs.length - 1)
				this.springs[i + 1].height += rDeltas[i];
		}
	}

	for (var i = 0; i < this.particles.length; i++) {
		this.updateParticle(this.particles[i]);
	}
	this.particles = this.particles.filter( function(element) {
		return element.position.x >= 0 && element.position.x < width && !this.liquid.contains(element);
	});
};

Liquid.prototype.splash = function (index, speed) {
	let x = Math.trunc(map(index, 0, width + this.springs.length, 0, this.springs.length));
	if (x >= 0 && x < this.springs.length) {
		this.springs[x].vel = speed;
	}

	this.createSplashParticles(index, speed);
};

Liquid.prototype.render = function () {
	this.draw();
	fill(0,0,255);
	noStroke();
	let scale = (width / (this.springs.length))+1;
	let bottom = height;
	for (var i = 1; i < this.springs.length; i++) {
		quad((i - 1) * scale, this.springs[i - 1].height, i * scale, this.springs[i].height, i * scale, bottom, (i - 1) * scale, bottom);
	}
};

Liquid.prototype.contains = function(mover) {
	let pos = Math.trunc(mover.position.x / this.springs.length);
	if ( mover.position.y >= this.springs[pos].height)
		return true;
	return false;
};




// MOVER CLASS ================================================================================================


function Mover(m, x, y) {
	this.mass = m;
	this.position = createVector(x,y);
	this.velocity = createVector(0,0);
	this.acceleration = createVector(0,0);
	this.color = color(0, 0, 0);
	let loc = map(x, 0, width, 0, bass.offsetWidth + mids.offsetWidth + treble.offsetWidth);
	if (loc >= 0 && loc <= bass.offsetWidth)
		this.color.setRed(255);
	else if (loc > bass.offsetWidth && loc <=  (bass.offsetWidth+mids.offsetWidth))
		this.color.setBlue(255);
	else
		this.color.setGreen(255);
};

// f = m / a --> a = f / m

Mover.prototype.applyForce = function(force) {
	var f = p5.Vector.div(force,this.mass);
	this.acceleration.add(f);
};

Mover.prototype.update = function() {
	this.velocity.add(this.acceleration);
	this.position.add(this.velocity);
	this.acceleration.mult(0); //acceleration must be cleared; does not add to itself!
};

Mover.prototype.display = function() {
	stroke(0); //black outline
	strokeWeight(2); //make it more visible
	
	fill(this.color); //give it a gray color
	ellipse(this.position.x,this.position.y,12,12); //create an ellipse at the position
	// image(img, this.position.x, this.position.y);
};

//P5 FUNCTIONS

function preload() {
	img = loadImage('./assets/images/Droplet.png');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);
	children = document.getElementById('header').children;
	bass = children[0];
	mids = children[1];
	treble = children[2];
	var temp = [];
	for (var i = 0; i < 201; i++) { //340 is an arbitrary num
		var tempSpring = new this.Spring();
		tempSpring.targetHeight = height/2;
		tempSpring.height = height/2;
		tempSpring.vel = 0;
		temp[i] = tempSpring;
	}
	liquid = new Liquid(temp);
	liquid.render();
}

function draw() {
	background(255);
	for (var i = 0; i < balls.length; i++) { // idea. Might need to iterate backwards through the array to delete the elements instead of forward. This gets rid of i--;

		if(liquid.contains(balls[i])) {
			let x = Math.trunc(map(balls[i].position.x, 0, width + this.liquid.springs.length, 0, this.liquid.springs.length));
			liquid.splash(balls[i].position.x, balls[i].velocity.y * 10);
			balls.splice(i, 1);
			i--;
		} else {
			// Gravity is scaled by mass here!
			var gravity = createVector(0, 0.1*balls[i].mass);
			balls[i].applyForce(gravity);
			balls[i].update();
			balls[i].display();
		}
		
		
	}
	liquid.update();
	liquid.render();
}

function mousePressed() {
	balls[balls.length] = new Mover(5, mouseX, mouseY);
}