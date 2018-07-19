var balls;

var liquid; 

var img;

var children;
var bass;
var mids;
var treble;

var ballLimit;



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
		this.springs[x].vel = speed/5;
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


function Mover(m, x, y, l, f) {
	this.freq = f;
	this.size = Math.round(l*100);
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
	ellipse(this.position.x,this.position.y,this.size,this.size); //create an ellipse at the position
	// image(img, this.position.x, this.position.y);
};

//P5 FUNCTIONS ================================================================================================

function preload() {
	
	img = loadImage('./assets/images/Droplet.png');
	setupAudio();
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);
	children = document.getElementById('header').children;
	ballLimit = [0,0,0];
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
	balls = [];
	liquid = new Liquid(temp);
	liquid.render();
}



function draw() {
	background(255);
	let level = audioLevel(); //calls from other javascript files?
	let spectrum = audioSpectrum();
	for (var i = 0; i< spectrum.length; i++) {
		 let x = map(i, 0, spectrum.length, 0, width);
		 //simple if else && spectrum[i] > bassEnergy()/100
		 if (i  >= 20 && i <= 140 && spectrum[i] > 0 && ballLimit[0] < 20) {
			ballLimit[0]++;
			balls.push(new Mover(spectrum[i] * 0.000001, x, 0, level, 0));
		 } else if (i >= 400 && i < 2600  && spectrum[i] > 0 && ballLimit[1] < 20) {
			ballLimit[1]++;
			balls.push(new Mover(spectrum[i] * 0.000001, x, 0, level, 1));
		 } else if (i >= 5200 && i <= 14000 && spectrum[i] > 0  && ballLimit[2] < 20) {
			ballLimit[2]++;
			balls.push(new Mover(spectrum[i] * 0.000001, x, 0, level, 2));
		 }
		// var h = -height + map(spectrum[i], 0, 255, height, 60);
		// rect(x, height, width / spectrum.length, h );
	}

	// balls.forEach(moveDrops);


	// for ( var ball of balls.values()) {
	// 	if(liquid.contains(ball)) {
	// 		// let x = Math.trunc(map(balls[i].position.x, 0, width + this.liquid.springs.length, 0, this.liquid.springs.length));
	// 		liquid.splash(ball.position.x, ball.velocity.y * 10);
	// 		balls.splice(i, 1);
	// 		i--;
	// 	} else {
	// 		// Gravity is scaled by mass here!
	// 		var gravity = createVector(0, 0.1*balls[i].mass);
	// 		balls[i].applyForce(gravity);
	// 		balls[i].update();
	// 		balls[i].display();
	// 	}
	// }

	for (var i = 0; i < balls.length; i++) { // idea. Might need to iterate backwards through the array to delete the elements instead of forward. This gets rid of i--;

		if(liquid.contains(balls[i])) {
			let x = Math.trunc(map(balls[i].position.x, 0, width + this.liquid.springs.length, 0, this.liquid.springs.length));
			liquid.splash(balls[i].position.x, balls[i].velocity.y * 10);
			ballLimit[balls[i].freq]--;
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

	// for ( var ball of balls.values()) {
	// 	if(liquid.contains(ball)) {
	// 		// let x = Math.trunc(map(balls[i].position.x, 0, width + this.liquid.springs.length, 0, this.liquid.springs.length));
	// 		liquid.splash(ball.position.x, ball.velocity.y * 10);
	// 		balls.splice(i, 1);
	// 		i--;
	// 	} else {
	// 		// Gravity is scaled by mass here!
	// 		var gravity = createVector(0, 0.1*balls[i].mass);
	// 		balls[i].applyForce(gravity);
	// 		balls[i].update();
	// 		balls[i].display();
	// 	}
	// }

	// for (var i = 0; i < balls.length; i++) { // idea. Might need to iterate backwards through the array to delete the elements instead of forward. This gets rid of i--;

	// 	if(liquid.contains(balls[i])) {
	// 		let x = Math.trunc(map(balls[i].position.x, 0, width + this.liquid.springs.length, 0, this.liquid.springs.length));
	// 		liquid.splash(balls[i].position.x, balls[i].velocity.y * 10);
	// 		balls.splice(i, 1);
	// 		i--;
	// 	} else {
	// 		// Gravity is scaled by mass here!
	// 		var gravity = createVector(0, 0.1*balls[i].mass);
	// 		balls[i].applyForce(gravity);
	// 		balls[i].update();
	// 		balls[i].display();
	// 	}
	// }
	liquid.update();
	liquid.render();
}

// function moveDrops(each) {
// 	if(liquid.contains(value)) {
// 		// let x = Math.trunc(map(balls[i].position.x, 0, width + this.liquid.springs.length, 0, this.liquid.springs.length));
// 		liquid.splash(value.position.x, value.velocity.y * 10);
// 		map.delete(key);
// 	} else {
// 		var gravity = createVector(0, 0.1*value.mass);
// 		value.applyForce(gravity);
// 		value.update();
// 		value.display();
// 	}	
//   }

function mousePressed() {
	togglePlay();
}



// #############################################################################################################################################################################################################





// var balls;

// var liquid; 
// var tempo;

// var img;

// var children;
// var bass;
// var mids;
// var treble;

// var ballLimit;

// var sectionMap;

// //PARTICLE CLASS ================================================================================================

// function Particle (position, velocity, orientation) {
// 	this.position = position;
// 	this.velocity = velocity;
// 	this.orientation = orientation;
// }



// //LIQUID CLASS ================================================================================================


// function Liquid(s) {
// 	this.springs = s;
// 	this.tension = 0.025;
// 	this.dampening = 0.025;
// 	this.spread = 0.25;
// 	this.scale = (width / this.springs.length)+1;
// 	this.particles = [];
// };

// function Spring() {
// 	this.targetHeight = 0;
// 	this.height = 0;
// 	this.vel = 0;

// 	this.update = function(dampening, tension) {
// 		let x = this.targetHeight - this.height;
// 		this.vel += (tension * x - this.vel * dampening);
// 		this.height += this.vel;
// 	}
// };

// // particle methods
// Liquid.prototype.getHeight = function(x) {
// 	if (x < 0 || x > width)
// 		return height/2;
	
	
// 	return this.springs[Math.trunc(x / this.springs.length)].height;
// }

// Liquid.prototype.updateParticle = function(particle) {
// 	gravity = 0.3;
// 	particle.velocity.y += gravity;
// 	particle.position.add(particle.velocity);
// 	particle.orientation = this.getAngle(particle.velocity);
// };

// Liquid.prototype.getAngle = function(vector) {
// 	return Math.atan2(vector.y, vector.x);
// }


// Liquid.prototype.drawParticle = function(particle) {
// 	noStroke();
// 	fill(0, 0, 255)
// 	ellipse(particle.position.x, particle.position.y, 5, 5);
// }

// Liquid.prototype.draw = function() {
// 	for (var i = 0; i < this.particles.length; i++) {
// 		this.drawParticle(this.particles[i]);
// 	}
// }

// Liquid.prototype.createSplashParticles = function(xPos, speed) {
// 	y = this.getHeight(xPos);

// 	if(speed > 0) {
// 		for (var i = 0; i < Math.trunc(speed/8); i++) {
// 			pos = createVector(xPos, y);
// 			pos.add(this.getRandomVector(40));
// 			vel = this.fromPolar(this.getRandomFloat(-150, -30), this.getRandomFloat(0, 0.5 * Math.sqrt(speed)));
//             this.particles.push(new Particle(pos, vel, 0));
// 		}
// 	}
// }

// Liquid.prototype.fromPolar = function(angle, magnitude) {
// 	vector = createVector(Math.cos(angle), Math.sin(angle));
// 	vector.mult(magnitude);
// 	return vector;
// }

// Liquid.prototype.getRandomFloat = function(min, max) {
// 	return random(min, max);
// }

// Liquid.prototype.getRandomVector = function(maxLength) {
// 	return this.fromPolar(this.getRandomFloat(-PI, PI), this.getRandomFloat(0, maxLength));
// }

// Liquid.prototype.update = function () {

// 	for (var i = 0; i < this.springs.length; i++)
// 		this.springs[i].update(this.dampening, this.tension);

// 	var lDeltas = [];
// 	var rDeltas = [];
	
// 	// do some passes where columns pull on their neighbours
// 	for (var j = 0; j < 6; j++) {
// 		for (var i = 0; i < this.springs.length; i++) {
// 			if (i > 0) {
// 				lDeltas[i] = this.spread * (this.springs[i].height - this.springs[i - 1].height);
// 				this.springs[i - 1].vel += lDeltas[i];
// 			}
// 			if (i < this.springs.length - 1) {
// 				rDeltas[i] = this.spread * (this.springs[i].height - this.springs[i + 1].height);
// 				this.springs[i + 1].vel += rDeltas[i];
// 			}
// 		}

// 		for (var i = 0; i < this.springs.length; i++) {
// 			if (i > 0)
// 				this.springs[i - 1].height += lDeltas[i];
// 			if (i < this.springs.length - 1)
// 				this.springs[i + 1].height += rDeltas[i];
// 		}
// 	}

// 	for (var i = 0; i < this.particles.length; i++) {
// 		this.updateParticle(this.particles[i]);
// 	}
// 	this.particles = this.particles.filter( function(element) {
// 		return element.position.x >= 0 && element.position.x < width && !this.liquid.contains(element);
// 	});
// };

// Liquid.prototype.splash = function (index, speed) {
// 	let x = Math.trunc(map(index, 0, width + this.springs.length, 0, this.springs.length));
// 	if (x >= 0 && x < this.springs.length) {
// 		this.springs[x].vel = speed/5;
// 	}

// 	this.createSplashParticles(index, speed);
// };

// Liquid.prototype.render = function () {
// 	this.draw();
// 	fill(0,0,255);
// 	noStroke();
// 	let scale = (width / (this.springs.length))+1;
// 	let bottom = height;
// 	for (var i = 1; i < this.springs.length; i++) {
// 		quad((i - 1) * scale, this.springs[i - 1].height, i * scale, this.springs[i].height, i * scale, bottom, (i - 1) * scale, bottom);
// 	}
// };

// Liquid.prototype.contains = function(mover) {
// 	let pos = Math.trunc(mover.position.x / this.springs.length);
// 	if ( mover.position.y >= this.springs[pos].height)
// 		return true;
// 	return false;
// };




// // MOVER CLASS ================================================================================================


// function Mover(m, x, y, l) {
// 	this.size = Math.round(l*100);
// 	this.mass = m;
// 	this.position = createVector(x,y);
// 	this.velocity = createVector(0,0);
// 	this.acceleration = createVector(0,0);
// 	this.color = color(0, 0, 0);
// 	let loc = map(x, 0, width, 0, bass.offsetWidth + mids.offsetWidth + treble.offsetWidth);
// 	if (loc >= 0 && loc <= bass.offsetWidth)
// 		this.color.setRed(255);
// 	else if (loc > bass.offsetWidth && loc <=  (bass.offsetWidth+mids.offsetWidth))
// 		this.color.setBlue(255);
// 	else
// 		this.color.setGreen(255);
// };

// // f = m / a --> a = f / m

// Mover.prototype.applyForce = function(force) {
// 	var f = p5.Vector.div(force,this.mass);
// 	this.acceleration.add(f);
// };

// Mover.prototype.update = function() {
// 	this.velocity.add(this.acceleration);
// 	this.position.add(this.velocity);
// 	this.acceleration.mult(0); //acceleration must be cleared; does not add to itself!
// };

// Mover.prototype.display = function() {
// 	stroke(0); //black outline
// 	strokeWeight(2); //make it more visible
	
// 	fill(this.color); //give it a gray color
// 	ellipse(this.position.x,this.position.y,this.size,this.size); //create an ellipse at the position
// 	// image(img, this.position.x, this.position.y);
// };

// //P5 FUNCTIONS ================================================================================================

// function preload() {
	
// 	img = loadImage('./assets/images/Droplet.png');
// 	setupAudio();
// }

// function setup() {
// 	createCanvas(windowWidth, windowHeight);
// 	background(255);
// 	children = document.getElementById('header').children;
// 	bass = children[0];
// 	mids = children[1];
// 	treble = children[2];
// 	var temp = [];
// 	for (var i = 0; i < 201; i++) { //340 is an arbitrary num
// 		var tempSpring = new this.Spring();
// 		tempSpring.targetHeight = height/2;
// 		tempSpring.height = height/2;
// 		tempSpring.vel = 0;
// 		temp[i] = tempSpring;
// 	}
// 	ballLimit = [];
// 	balls = [];
// 	liquid = new Liquid(temp);
// 	liquid.render();
// }



// function draw() {
// 	background(255);
// 	let level = audioLevel(); //calls from other javascript files?
// 	detectBeat(level);
// 	// let spectrum = audioSpectrum();
// 	// for (var i = 0; i< spectrum.length; i++) {
// 	// 	 let x = map(i, 0, spectrum.length, 0, width);
// 	// 	 //simple if else
// 	// 	 if (i  >= 0 && i <= 140 && spectrum[i] > bassEnergy()/5 && !balls.has(i)) {
// 	// 		balls.set(i, new Mover(spectrum[i] * 0.000001, x, 0, level));
// 	// 	 } else if (i >= 400 && i < 2600 && spectrum[i] > midEnergy()/5 && !balls.has(i)) {
// 	// 		balls.set(i, new Mover(spectrum[i] * 0.000001, x, 0, level));
// 	// 	 } else if (i >= 5200 && i <= 14000 && spectrum[i] > trebleEnergy()/5 && !balls.has(i)) {
// 	// 		balls.set(i, new Mover(spectrum[i] * 0.000001, x, 0, level));
// 	// 	 }
// 	// 	// var h = -height + map(spectrum[i], 0, 255, height, 60);
// 	// 	// rect(x, height, width / spectrum.length, h );
// 	// }

// 	for (var i = 0; i < balls.length; i++) { // idea. Might need to iterate backwards through the array to delete the elements instead of forward. This gets rid of i--;

// 		if(liquid.contains(balls[i])) {
// 			let x = Math.trunc(map(balls[i].position.x, 0, width + this.liquid.springs.length, 0, this.liquid.springs.length));
// 			liquid.splash(balls[i].position.x, balls[i].velocity.y * 10);
// 			ballLimit[balls[i].freq]--;
// 			balls.splice(i, 1);
// 			i--;
// 		} else {
// 			// Gravity is scaled by mass here!
// 			var gravity = createVector(0, 0.1*balls[i].mass);
// 			balls[i].applyForce(gravity);
// 			balls[i].update();
// 			balls[i].display();
// 		}
// 	}

	
// 	liquid.update();
// 	liquid.render();
// }

// function moveDrops(value, key, map) {
// 	if(liquid.contains(value)) {
// 		// let x = Math.trunc(map(balls[i].position.x, 0, width + this.liquid.springs.length, 0, this.liquid.springs.length));
// 		liquid.splash(value.position.x, value.velocity.y * 10);
// 		map.delete(key);
// 	} else {
// 		var gravity = createVector(0, 0.1*value.mass);
// 		value.applyForce(gravity);
// 		value.update();
// 		value.display();
// 	}	
//   }

// function mousePressed() {
// 	togglePlay();
// }

// // TEMPO FUNCTIONS ================================================================================================================================

// // :: Beat Detect Variables
// // how many draw loop frames before the beatCutoff starts to decay
// // so that another beat can be triggered.
// // frameRate() is usually around 60 frames per second,
// // so 20 fps = 3 beats per second, meaning if the song is over 180 BPM,
// // we wont respond to every beat.
// var beatHoldFrames = 30;

// // what amplitude level can trigger a beat?
// var beatThreshold = 0.11; 

// // When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// // Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
// var beatCutoff = 0;
// var beatDecayRate = 0.98; // how fast does beat cutoff decay?
// var framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.


// function detectBeat(level) {
//   if (level  > beatCutoff && level > beatThreshold){
//     onBeat(level);
//     beatCutoff = level *1.2;
//     framesSinceLastBeat = 0;
//   } else{
//     if (framesSinceLastBeat <= beatHoldFrames){
//       framesSinceLastBeat ++;
//     }
//     else{
//       beatCutoff *= beatDecayRate;
//       beatCutoff = Math.max(beatCutoff, beatThreshold);
//     }
//   }
// }

// function onBeat(level) {
// 	let spectrum = audioSpectrum();
// 	for (var i = 0; i< spectrum.length; i++) {
// 		let x = map(i, 0, spectrum.length, 0, width);
// 		//simple if else && spectrum[i] > bassEnergy()/100
// 		if (i  >= 20 && i <= 140 && spectrum[i] > 0 && ballLimit[0] < 20) {
// 		   ballLimit[0]++;
// 		   balls.push(new Mover(spectrum[i] * 0.000001, x, 0, level, 0));
// 		} else if (i >= 400 && i < 2600  && spectrum[i] > 0 && ballLimit[1] < 20) {
// 		   ballLimit[1]++;
// 		   balls.push(new Mover(spectrum[i] * 0.000001, x, 0, level, 1));
// 		} else if (i >= 5200 && i <= 14000 && spectrum[i] > 0  && ballLimit[2] < 20) {
// 		   ballLimit[2]++;
// 		   balls.push(new Mover(spectrum[i] * 0.000001, x, 0, level, 2));
// 		}
// 	   // var h = -height + map(spectrum[i], 0, 255, height, 60);
// 	   // rect(x, height, width / spectrum.length, h );
//    }

   
	
// }

// // /**
// //  *  This technique tracks a beatThreshold level.
// //  *  
// //  *  When the current volume exceeds the beatThreshold, we have a beat, and
// //  *  "debounce" to ensure each beat only triggers once.
// //  *  
// //  *  When a beat is detected, we do two things to "debounce":
// //  *   - Increase the threshold, so that we don't get another
// //  *     beat right away, by adding a beatCutoff to the beatThreshold.
// //  *     The beatCutoff decays back to beatThreshold level at beatDecayRate.
// //  *   - Wait a certain amount of time before detecting another beat. This is
// //  *     accomplished by tracking framesSinceLastBeat > beatHoldFrames.
// //  *
// //  *  Each run through the Draw loop, the detectBeat() function decides
// //  *  whether we have a beat or not based on these Beat Detect Variables
// //  *  and the current amplitude level. 
// //  *  
// //  *  Thank you to Felix Turner's "Simple Beat Detection"
// //  *  http://www.airtightinteractive.com/2013/10/making-audio-reactive-visuals/
// //  */

// // var soundFile;
// // var amplitude;

// // var backgroundColor;

// // // rectangle parameters
// // var rectRotate = true;
// // var rectMin = 15;
// // var rectOffset = 20;
// // var numRects = 10;

// // // :: Beat Detect Variables
// // // how many draw loop frames before the beatCutoff starts to decay
// // // so that another beat can be triggered.
// // // frameRate() is usually around 60 frames per second,
// // // so 20 fps = 3 beats per second, meaning if the song is over 180 BPM,
// // // we wont respond to every beat.
// // var beatHoldFrames = 30;

// // // what amplitude level can trigger a beat?
// // var beatThreshold = 0.11; 

// // // When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// // // Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
// // var beatCutoff = 0;
// // var beatDecayRate = 0.98; // how fast does beat cutoff decay?
// // var framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.


// // function preload() {
// //   soundFile = loadSound('../../music/YACHT_-_06_-_Summer_Song_Instrumental.mp3');
// // }

// // function setup() {
// //   c = createCanvas(windowWidth, windowHeight);
// //   noStroke();
// //   rectMode(CENTER);
// //   backgroundColor = color( random(0,255), random(0,255), random(0,255) );

// //   amplitude = new p5.Amplitude();

// //   soundFile.play();

// //   amplitude.setInput(soundFile);
// //   amplitude.smooth(0.9);
// // }

// // function draw() {
// //   background(backgroundColor);

// //   var level = amplitude.getLevel();
// //   detectBeat(level);

// //   // distort the rectangle based based on the amp
// //   var distortDiam = map(level, 0, 1, 0, 1200);
// //   var w = rectMin;
// //   var h = rectMin;

// //   // distortion direction shifts each beat
// //   if (rectRotate) {
// //     var rotation = PI/ 2;
// //   } else {
// //     var rotation = PI/ 3;
// //   }

// //   // rotate the drawing coordinates to rectCenter position
// //   var rectCenter = createVector(width/3, height/2);

// //   push();

// //     // draw the rectangles
// //     for (var i = 0; i < numRects; i++) {
// //       var x = rectCenter.x + rectOffset * i;
// //       var y = rectCenter.y + distortDiam/2;
// //       // rotate around the center of this rectangle
// //       translate(x, y); 
// //       rotate(rotation);
// //       rect(0, 0, rectMin, rectMin + distortDiam);
// //     }
// //   pop();
// // }



// // function windowResized() {
// //   resizeCanvas(windowWidth, windowHeight);
// //   background(0);
// // }



// FINAL PROJECT VERSION BEFORE CLEANUP

// var balls;

// var liquid; 

// var img;

// var children;
// var bass;
// var mids;
// var treble;

// var ballLimit;



// var sectionMap;

// var beatHoldFrames = 30;

// // what amplitude level can trigger a beat?
// var beatThreshold = 0.11; 

// // When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// // Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
// var beatCutoff = 0;
// var beatDecayRate = 0.98; // how fast does beat cutoff decay?
// var framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.

// //PARTICLE CLASS ================================================================================================

// function Particle (position, velocity, orientation) {
// 	this.position = position;
// 	this.velocity = velocity;
// 	this.orientation = orientation;
// }



// //LIQUID CLASS ================================================================================================


// function Liquid(s) {
// 	this.springs = s;
// 	this.tension = 0.025;
// 	this.dampening = 0.025;
// 	this.spread = 0.25;
// 	this.scale = (width / this.springs.length)+1;
// 	this.particles = [];
// };

// function Spring() {
// 	this.targetHeight = 0;
// 	this.height = 0;
// 	this.vel = 0;

// 	this.update = function(dampening, tension) {
// 		let x = this.targetHeight - this.height;
// 		this.vel += (tension * x - this.vel * dampening);
// 		this.height += this.vel;
// 	}
// };

// // particle methods
// Liquid.prototype.getHeight = function(x) {
// 	if (x < 0 || x > width)
// 		return height/2;
	
	
// 	return this.springs[Math.trunc(x / this.springs.length)].height;
// }

// Liquid.prototype.updateParticle = function(particle) {
// 	gravity = 0.3;
// 	particle.velocity.y += gravity;
// 	particle.position.add(particle.velocity);
// 	particle.orientation = this.getAngle(particle.velocity);
// };

// Liquid.prototype.getAngle = function(vector) {
// 	return Math.atan2(vector.y, vector.x);
// }


// Liquid.prototype.drawParticle = function(particle) {
// 	noStroke();
// 	fill(0, 0, 255)
// 	ellipse(particle.position.x, particle.position.y, 5, 5);
// }

// Liquid.prototype.draw = function() {
// 	for (var i = 0; i < this.particles.length; i++) {
// 		this.drawParticle(this.particles[i]);
// 	}
// }

// Liquid.prototype.createSplashParticles = function(xPos, speed) {
// 	y = this.getHeight(xPos);

// 	if(speed > 0) {
// 		for (var i = 0; i < Math.trunc(speed/8); i++) {
// 			pos = createVector(xPos, y);
// 			pos.add(this.getRandomVector(40));
// 			vel = this.fromPolar(this.getRandomFloat(-150, -30), this.getRandomFloat(0, 0.5 * Math.sqrt(speed)));
//             this.particles.push(new Particle(pos, vel, 0));
// 		}
// 	}
// }

// Liquid.prototype.fromPolar = function(angle, magnitude) {
// 	vector = createVector(Math.cos(angle), Math.sin(angle));
// 	vector.mult(magnitude);
// 	return vector;
// }

// Liquid.prototype.getRandomFloat = function(min, max) {
// 	return random(min, max);
// }

// Liquid.prototype.getRandomVector = function(maxLength) {
// 	return this.fromPolar(this.getRandomFloat(-PI, PI), this.getRandomFloat(0, maxLength));
// }

// Liquid.prototype.update = function () {

// 	for (var i = 0; i < this.springs.length; i++)
// 		this.springs[i].update(this.dampening, this.tension);

// 	var lDeltas = [];
// 	var rDeltas = [];
	
// 	// do some passes where columns pull on their neighbours
// 	for (var j = 0; j < 6; j++) {
// 		for (var i = 0; i < this.springs.length; i++) {
// 			if (i > 0) {
// 				lDeltas[i] = this.spread * (this.springs[i].height - this.springs[i - 1].height);
// 				this.springs[i - 1].vel += lDeltas[i];
// 			}
// 			if (i < this.springs.length - 1) {
// 				rDeltas[i] = this.spread * (this.springs[i].height - this.springs[i + 1].height);
// 				this.springs[i + 1].vel += rDeltas[i];
// 			}
// 		}

// 		for (var i = 0; i < this.springs.length; i++) {
// 			if (i > 0)
// 				this.springs[i - 1].height += lDeltas[i];
// 			if (i < this.springs.length - 1)
// 				this.springs[i + 1].height += rDeltas[i];
// 		}
// 	}

// 	for (var i = 0; i < this.particles.length; i++) {
// 		this.updateParticle(this.particles[i]);
// 	}
// 	this.particles = this.particles.filter( function(element) {
// 		return element.position.x >= 0 && element.position.x < width && !this.liquid.contains(element);
// 	});
// };

// Liquid.prototype.splash = function (index, speed) {
// 	let x = Math.trunc(map(index, 0, width + this.springs.length, 0, this.springs.length));
// 	if (x >= 0 && x < this.springs.length) {
// 		this.springs[x].vel = speed/5;
// 	}

// 	this.createSplashParticles(index, speed);
// };

// Liquid.prototype.render = function () {
// 	this.draw();
// 	fill(0,0,255);
// 	noStroke();
// 	let scale = (width / (this.springs.length))+1;
// 	let bottom = height;
// 	for (var i = 1; i < this.springs.length; i++) {
// 		quad((i - 1) * scale, this.springs[i - 1].height, i * scale, this.springs[i].height, i * scale, bottom, (i - 1) * scale, bottom);
// 	}
// };

// Liquid.prototype.contains = function(mover) {
// 	let pos = Math.trunc(mover.position.x / this.springs.length);
// 	if ( mover.position.y >= this.springs[pos].height)
// 		return true;
// 	return false;
// };




// // MOVER CLASS ================================================================================================


// function Mover(m, x, y, l, f) {
// 	this.freq = f;
// 	this.size = Math.round(l*100);
// 	this.mass = m;
// 	this.position = createVector(x,y);
// 	this.velocity = createVector(0,0);
// 	this.acceleration = createVector(0,0);
// 	this.color = color(0, 0, 0);
// 	let loc = map(x, 0, width, 0, bass.offsetWidth + mids.offsetWidth + treble.offsetWidth);
// 	if (loc >= 0 && loc <= bass.offsetWidth)
// 		this.color.setRed(255);
// 	else if (loc > bass.offsetWidth && loc <=  (bass.offsetWidth+mids.offsetWidth))
// 		this.color.setBlue(255);
// 	else
// 		this.color.setGreen(255);
// };

// // f = m / a --> a = f / m

// Mover.prototype.applyForce = function(force) {
// 	var f = p5.Vector.div(force,this.mass);
// 	this.acceleration.add(f);
// };

// Mover.prototype.update = function() {
// 	this.velocity.add(this.acceleration);
// 	this.position.add(this.velocity);
// 	this.acceleration.mult(0); //acceleration must be cleared; does not add to itself!
// };

// Mover.prototype.display = function() {
// 	stroke(0); //black outline
// 	strokeWeight(2); //make it more visible
	
// 	fill(this.color); //give it a gray color
// 	ellipse(this.position.x,this.position.y,this.size,this.size); //create an ellipse at the position
// 	// image(img, this.position.x, this.position.y);
// };

// //P5 FUNCTIONS ================================================================================================

// function preload() {
	
// 	img = loadImage('./assets/images/Droplet.png');
// 	setupAudio();
// }

// function setup() {
// 	createCanvas(windowWidth, windowHeight);
// 	background(255);
// 	children = document.getElementById('header').children;
// 	ballLimit = [0,0,0];
// 	bass = children[0];
// 	mids = children[1];
// 	treble = children[2];
// 	var temp = [];
// 	for (var i = 0; i < 201; i++) { //340 is an arbitrary num
// 		var tempSpring = new this.Spring();
// 		tempSpring.targetHeight = height/2;
// 		tempSpring.height = height/2;
// 		tempSpring.vel = 0;
// 		temp[i] = tempSpring;
// 	}
// 	balls = [];
// 	liquid = new Liquid(temp);
// 	liquid.render();
// }



// function draw() {
// 	background(255);
// 	let level = audioLevel(); //calls from other javascript files?
// 	detectBeat(level)
	

// 	// balls.forEach(moveDrops);


// 	// for ( var ball of balls.values()) {
// 	// 	if(liquid.contains(ball)) {
// 	// 		// let x = Math.trunc(map(balls[i].position.x, 0, width + this.liquid.springs.length, 0, this.liquid.springs.length));
// 	// 		liquid.splash(ball.position.x, ball.velocity.y * 10);
// 	// 		balls.splice(i, 1);
// 	// 		i--;
// 	// 	} else {
// 	// 		// Gravity is scaled by mass here!
// 	// 		var gravity = createVector(0, 0.1*balls[i].mass);
// 	// 		balls[i].applyForce(gravity);
// 	// 		balls[i].update();
// 	// 		balls[i].display();
// 	// 	}
// 	// }

// 	for (var i = 0; i < balls.length; i++) { // idea. Might need to iterate backwards through the array to delete the elements instead of forward. This gets rid of i--;

// 		if(liquid.contains(balls[i])) {
// 			let x = Math.trunc(map(balls[i].position.x, 0, width + this.liquid.springs.length, 0, this.liquid.springs.length));
// 			liquid.splash(balls[i].position.x, balls[i].velocity.y * 10);
// 			ballLimit[balls[i].freq]--;
// 			balls.splice(i, 1);
// 			i--;
// 		} else {
// 			// Gravity is scaled by mass here!
// 			var gravity = createVector(0, 0.1*balls[i].mass);
// 			balls[i].applyForce(gravity);
// 			balls[i].update();
// 			balls[i].display();
// 		}
// 	}

// 	// for ( var ball of balls.values()) {
// 	// 	if(liquid.contains(ball)) {
// 	// 		// let x = Math.trunc(map(balls[i].position.x, 0, width + this.liquid.springs.length, 0, this.liquid.springs.length));
// 	// 		liquid.splash(ball.position.x, ball.velocity.y * 10);
// 	// 		balls.splice(i, 1);
// 	// 		i--;
// 	// 	} else {
// 	// 		// Gravity is scaled by mass here!
// 	// 		var gravity = createVector(0, 0.1*balls[i].mass);
// 	// 		balls[i].applyForce(gravity);
// 	// 		balls[i].update();
// 	// 		balls[i].display();
// 	// 	}
// 	// }

// 	// for (var i = 0; i < balls.length; i++) { // idea. Might need to iterate backwards through the array to delete the elements instead of forward. This gets rid of i--;

// 	// 	if(liquid.contains(balls[i])) {
// 	// 		let x = Math.trunc(map(balls[i].position.x, 0, width + this.liquid.springs.length, 0, this.liquid.springs.length));
// 	// 		liquid.splash(balls[i].position.x, balls[i].velocity.y * 10);
// 	// 		balls.splice(i, 1);
// 	// 		i--;
// 	// 	} else {
// 	// 		// Gravity is scaled by mass here!
// 	// 		var gravity = createVector(0, 0.1*balls[i].mass);
// 	// 		balls[i].applyForce(gravity);
// 	// 		balls[i].update();
// 	// 		balls[i].display();
// 	// 	}
// 	// }
// 	liquid.update();
// 	liquid.render();
// }

// // function moveDrops(each) {
// // 	if(liquid.contains(value)) {
// // 		// let x = Math.trunc(map(balls[i].position.x, 0, width + this.liquid.springs.length, 0, this.liquid.springs.length));
// // 		liquid.splash(value.position.x, value.velocity.y * 10);
// // 		map.delete(key);
// // 	} else {
// // 		var gravity = createVector(0, 0.1*value.mass);
// // 		value.applyForce(gravity);
// // 		value.update();
// // 		value.display();
// // 	}	
// //   }

// function mousePressed() {
// 	togglePlay();
// }


// function detectBeat(level) {
//   if (level  > beatCutoff && level > beatThreshold){
//     onBeat(level);
//     beatCutoff = level *1.2;
//     framesSinceLastBeat = 0;
//   } else{
//     if (framesSinceLastBeat <= beatHoldFrames){
//       framesSinceLastBeat ++;
//     }
//     else{
//       beatCutoff *= beatDecayRate;
//       beatCutoff = Math.max(beatCutoff, beatThreshold);
//     }
//   }
// }

// function onBeat(level) {
// 	let spectrum = audioSpectrum();
// 	for (var i = 0; i< spectrum.length; i++) {
// 		 let x = map(i, 0, spectrum.length, 0, width);
// 		 //simple if else && spectrum[i] > bassEnergy()/100
// 		 if (i  >= 0 && i <= 140 && spectrum[i] > 0) {
// 			balls.push(new Mover(spectrum[i] * 0.000001, x, 0, level, 0));
// 		 } else if (i >= 400 && i < 2600  && spectrum[i] > 0 ) {
// 			balls.push(new Mover(spectrum[i] * 0.000001, x, 0, level, 1));
// 		 } else if (i >= 5200 && i <= 14000 && spectrum[i] > 0 ) {
// 			balls.push(new Mover(spectrum[i] * 0.000001, x, 0, level, 2));
// 		 }
// 		// var h = -height + map(spectrum[i], 0, 255, height, 60);
// 		// rect(x, height, width / spectrum.length, h );
// 	}
// }