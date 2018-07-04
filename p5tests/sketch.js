	var balls = [];

	var liquid; 

	function Liquid(s) {
		this.springs = s;
		this.tension = 0.025;
		this.dampening = 0.025;
		this.spread = 0.25;
	}

	function Spring() {
		this.targetHeight = 0;
		this.height = 0;
		this.vel = 0;

		this.update = function(dampening, tension) {
			let x = this.targetHeight - this.height;
			this.vel += (tension * x - this.vel * dampening);
			this.height += this.vel;
		}
	}

	Liquid.prototype.update = function () {

		for (var i = 0; i < this.springs.length; i++)
			this.springs[i].update(this.dampening, this.tension);

		var lDeltas = [];
		var rDeltas = [];
		
		// do some passes where columns pull on their neighbours
		for (var j = 0; j < 8; j++)
		{
			for (var i = 0; i < this.springs.length; i++)
			{
				if (i > 0)
				{
					lDeltas[i] = this.spread * (this.springs[i].height - this.springs[i - 1].height);
					this.springs[i - 1].vel += lDeltas[i];
				}
				if (i < this.springs.length - 1)
				{
					rDeltas[i] = this.spread * (this.springs[i].height - this.springs[i + 1].height);
					this.springs[i + 1].vel += rDeltas[i];
				}
			}

			for (var i = 0; i < this.springs.length; i++)
			{
				if (i > 0)
					this.springs[i - 1].height += lDeltas[i];
				if (i < this.springs.length - 1)
					this.springs[i + 1].height += rDeltas[i];
			}
		}
	}

	Liquid.prototype.splash = function (index, speed) {
		if (index >= 0 && index < this.springs.length)
			this.springs[i].vel = speed;
	}

	Liquid.prototype.display = function () {
		fill(0, 0, 255);
		beginShape();
		vertex(0, height - this.springs[0].height);
		for (var i = 0; i < this.springs.length; i++) {
			vertex(i * (width / this.springs.length), height-this.springs[i].height); //consider using the map function
		}
		vertex(width, height);
		vertex(0, height);
		endShape(CLOSE);
	}

	Liquid.prototype.contains = function(m) {
		return true;
	};

	function Mover(m, x, y) {
		this.mass = m;
		this.position = createVector(x,y);
		this.velocity = createVector(0,0);
		this.acceleration = createVector(0,0);
	}

	// f = m / a --> a = f / m

	Mover.prototype.applyForce = function(force) {
		var f = p5.Vector.div(force,this.mass);
		this.acceleration.add(f);
	}

	Mover.prototype.update = function() {
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
		this.acceleration.mult(0); //acceleration must be cleared; does not add to itself!
	};

	Mover.prototype.display = function() {
		stroke(0); //black outline
		strokeWeight(2); //make it more visible
		fill(255,127); //give it a gray color
		ellipse(this.position.x,this.position.y,this.mass*16,this.mass*16); //create an ellipse at the position
	};

	function setup() {
		createCanvas(windowWidth, windowHeight);
		background(255);
		var temp = [];
		for (var i = 0; i < 340; i++) { //340 is an arbitrary num
			var tempSpring = new this.Spring();
			tempSpring.targetHeight = height/2;
			tempSpring.height = height/2;
			temp[i] = tempSpring;
		}
		liquid = new Liquid(temp);
		liquid.display();
	}

	function draw() {
		background(255);
		for (var i = 0; i < balls.length; i++) {

			if(liquid.contains(balls[i])) {
				liquid.splash(balls[i].x, 0.05);
			}
			liquid.update();
			liquid.display();
			// Gravity is scaled by mass here!
			var gravity = createVector(0, 0.1*balls[i].mass);
			// Apply gravity
			balls[i].applyForce(gravity);
			balls[i].update();
			balls[i].display();
			
			
		}
		liquid.display();
	}

	function mousePressed() {
		balls[balls.length] = new Mover(5, mouseX, mouseY);
	}