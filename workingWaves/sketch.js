	var balls = [];

	var liquid; 

	function Liquid(s) {
		this.springs = s;
		this.tension = 0.025;
		this.dampening = 0.025;
		this.spread = 0.25;
		this.scale = (width / this.springs.length)+1;
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

	Liquid.prototype.update = function () {

		for (var i = 0; i < this.springs.length; i++)
			this.springs[i].update(this.dampening, this.tension);

		var lDeltas = [];
		var rDeltas = [];
		
		// do some passes where columns pull on their neighbours
		for (var j = 0; j < 6; j++)
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
	};

	Liquid.prototype.splash = function (index, speed) {
		if (index >= 0 && index < this.springs.length) {
			this.springs[index].vel = speed;
		}
	};

	Liquid.prototype.render = function () {
		fill(0, 0, 255);
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


	function Mover(m, x, y) {
		this.mass = m;
		this.position = createVector(x,y);
		this.velocity = createVector(0,0);
		this.acceleration = createVector(0,0);
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
		fill(255,127); //give it a gray color
		ellipse(this.position.x,this.position.y,12,12); //create an ellipse at the position
	};

	function setup() {
		createCanvas(windowWidth, windowHeight);
		background(255);
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
		for (var i = 0; i < balls.length; i++) {

			if(liquid.contains(balls[i])) {
				let x = Math.trunc(map(balls[i].position.x, 0, width + this.liquid.springs.length, 0, this.liquid.springs.length));
				console.log(balls[i].velocity.y);
				liquid.splash(x, balls[i].velocity.y * 10);
				balls.splice(i, 1);
			} else {
				// liquid.update();
				// liquid.render();
				// Gravity is scaled by mass here!
				var gravity = createVector(0, 0.1*balls[i].mass);
				// Apply gravity
				balls[i].applyForce(gravity);
				balls[i].update();
				balls[i].display();
			}
			
			
		}
		// // liquid.render();

		// liquid.splash(100, 100);
		liquid.update();
		liquid.render();
	}

	function mousePressed() {
		balls[balls.length] = new Mover(5, mouseX, mouseY);
	}