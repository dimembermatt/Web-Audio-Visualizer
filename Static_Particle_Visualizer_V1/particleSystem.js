/**
 * particleSystem.js
 * Matthew Yu
 * Web-Audio-Visualizer Project (2018)
 * Visualizer source code that enables visualization for the Static_Particle_Visualizer.
 */
/**
 * function create2dArray establishes a new array organized based on input
 * @param rows: number of rows
 * @param columns: number of columns
 * @return reference to the created array
 */
function create2dArray(rows, columns) {
  var arr = new Array(rows);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(columns);
  }
  return arr;
}

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Particle {
  /**
   * class function constructor creates a particle
   * @param basePSize: initial size of particle
   * the color of each particle in the system is set at random on initialization.
   */
  constructor(basePSize) {
    this.size = basePSize;
    this.alpha = 255;
    this.color = [random(0, 255), random(0, 255), random(0, 255), this.alpha];
  }
}

class ParticleSystem {
  /**
   * class function constructor creates a 2d array of particles
   * @param rows: # of rows of the particleSystem
   * @param columns: # of columns of the particleSystem
   * @param basePSize: initial size of particles and minimum size
   * @param decayRate: how fast particles shrink over time
   * the color of each particle in the system is set at random on initialization.
   */
  constructor(rows, columns, basePSize, decayRate, setting) {
    this.rows = rows;
    this.columns = columns;
    this.decayRate = decayRate;
    this.basePSize = basePSize;
    this.setting = setting;
    this.pSystem = create2dArray(rows, columns);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        //setting defined on creation
        if (this.setting === 1) {
          this.pSystem[i][j] = new Particle(basePSize);
        } else if (this.setting === 2) {
          if (random(0, 1) > .5)
            this.pSystem[i][j] = new Particle(basePSize);
          else
            this.pSystem[i][j] = new Particle(10);
        } else;
      }
    }
  }

  /**
   * class function display draws every particle in the particleSystem on the canvas
   * based on their size, location in the system array, and color.
   * @param sectionWidth: width of each column of the particleSystem on the canvas
   * @param sectionHeight: height of each row of the particleSystem on the canvas
   */
  display(sectionWidth, sectionHeight) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        noStroke();
        let particle = this.pSystem[i][j];
        fill(particle.color[0], particle.color[1], particle.color[2], particle.alpha);
        ellipse(j * sectionWidth + sectionWidth/2, i * sectionHeight + sectionHeight/2, particle.size);
      }
    }
  }

  /**
   * class function update changes the size of every particle based on the
   * average of the surrounding neighbor particles in the system.
   */
  update() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        let sum = 0;
        let count = 1;
        if ((0 < i && i < this.rows - 1) && (0 < j && j < this.columns - 1)) {
          sum += this.pSystem[i - 1][j - 1].size;   //top left
          sum += this.pSystem[i - 1][j + 1].size;   //top right
          sum += this.pSystem[i + 1][j - 1].size;   //bottom left
          sum += this.pSystem[i + 1][j + 1].size;   //bottom right
          sum += this.pSystem[i][j + 1].size;       //right
          sum += this.pSystem[i][j - 1].size;       //left
          sum += this.pSystem[i + 1][j].size;       //down
          sum += this.pSystem[i - 1][j].size;       //up
          count += 8;
        } else if (i === 0) {
          if (j === 0) { //top left corner
            sum += this.pSystem[i][j + 1].size;     //right
            sum += this.pSystem[i + 1][j].size;     //down
            sum += this.pSystem[i + 1][j + 1].size; //bottom right
            count += 3;
          } else if (j === this.columns - 1) {//top right corner
            sum += this.pSystem[i][j - 1].size;     //left
            sum += this.pSystem[i + 1][j].size;     //down
            sum += this.pSystem[i + 1][j - 1].size; //bottom left
            count += 3;
          } else {//top row
            sum += this.pSystem[i][j + 1].size;     //right
            sum += this.pSystem[i][j - 1].size;     //left
            sum += this.pSystem[i + 1][j].size;     //down
            sum += this.pSystem[i + 1][j - 1].size; //bottom left
            sum += this.pSystem[i + 1][j + 1].size; //bottom right
            count += 5;
          }
        } else {
          if (j === 0) { //bottom left corner
            sum += this.pSystem[i][j + 1].size;     //right
            sum += this.pSystem[i - 1][j].size;     //up
            sum += this.pSystem[i - 1][j + 1].size; //top right
            count += 3;
          } else if (j === this.columns - 1) { //bottom right corner
            sum += this.pSystem[i][j - 1].size;     //left
            sum += this.pSystem[i - 1][j].size;     //up
            sum += this.pSystem[i - 1][j - 1].size; //top left
            count += 3;
          } else { //bottom row
            sum += this.pSystem[i][j + 1].size;     //right
            sum += this.pSystem[i][j - 1].size;     //left
            sum += this.pSystem[i - 1][j].size;     //up
            sum += this.pSystem[i - 1][j - 1].size; //top left
            sum += this.pSystem[i - 1][j + 1].size; //top right
            count += 5;
          }
        }


        sum += this.pSystem[i][j].size;
        let weightedAvg = sum/count;
        this.pSystem[i][j].size = weightedAvg * this.decayRate <= this.basePSize ? this.basePSize : weightedAvg * this.decayRate;
        //visual options
        if (this.pSystem[i][j].size === this.basePSize) {
          if (fizzBool) {
            this.pSystem[i][j].size = this.basePSize * random(.8, 12);
          } else if (discoBool) {
            this.pSystem[i][j].size = random(4, 10);
          } else;
        }
      }
    }
  }
  //Conway's Game of Life - cells live or die based on state of neighbor cells
  updateCellularAutomata1() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        let on = 10;
        let count = 0;
        if ((0 < i && i < this.rows - 1) && (0 < j && j < this.columns - 1)) {
          if (this.pSystem[i - 1][j - 1].size >= on)   //top left
            count++;
          if (this.pSystem[i - 1][j + 1].size >= on)   //top right
            count++;
          if (this.pSystem[i + 1][j - 1].size >= on)   //bottom left
            count++;
          if (this.pSystem[i + 1][j + 1].size >= on)   //bottom right
            count++;
          if (this.pSystem[i][j + 1].size >= on)       //right
            count++;
          if (this.pSystem[i][j - 1].size >= on)       //left
            count++;
          if (this.pSystem[i + 1][j].size >= on)       //down
            count++;
          if (this.pSystem[i - 1][j].size >= on)       //up
            count++;
        } else if (i === 0) {
          if (j === 0) { //top left corner
            if (this.pSystem[i][j + 1].size >= on)     //right
              count++;
            if (this.pSystem[i + 1][j].size >= on)     //down
              count++;
            if (this.pSystem[i + 1][j + 1].size >= on) //bottom right
              count++;
          } else if (j === this.columns - 1) {//top right corner
            if (this.pSystem[i][j - 1].size >= on)     //left
              count++;
            if (this.pSystem[i + 1][j].size >= on)     //down
              count++;
            if (this.pSystem[i + 1][j - 1].size >= on) //bottom left
              count++;
          } else {//top row
            if (this.pSystem[i][j + 1].size >= on)     //right
              count++;
            if (this.pSystem[i][j - 1].size >= on)     //left
              count++;
            if (this.pSystem[i + 1][j].size >= on)     //down
              count++;
            if (this.pSystem[i + 1][j - 1].size >= on) //bottom left
              count++;
            if (this.pSystem[i + 1][j + 1].size >= on) //bottom right
              count++;
          }
        } else {
          if (j === 0) { //bottom left corner
            if (this.pSystem[i][j + 1].size >= on)     //right
              count++;
            if (this.pSystem[i - 1][j].size >= on)     //up
              count++;
            if (this.pSystem[i - 1][j + 1].size >= on) //top right
              count++;
          } else if (j === this.columns - 1) { //bottom right corner
            if (this.pSystem[i][j - 1].size >= on)     //left
              count++;
            if (this.pSystem[i - 1][j].size >= on)     //up
              count++;
            if (this.pSystem[i - 1][j - 1].size >= on) //top left
              count++;
          } else { //bottom row
            if (this.pSystem[i][j + 1].size >= on)     //right
              count++;
            if (this.pSystem[i][j - 1].size >= on)     //left
              count++;
            if (this.pSystem[i - 1][j].size >= on)     //up
              count++;
            if (this.pSystem[i - 1][j - 1].size >= on) //top left
              count++;
            if (this.pSystem[i - 1][j + 1].size >= on) //top right
              count++;
          }
        }
        if (count >= 3 && count < 5) {
          if (this.pSystem[i][j].size > 10)
            this.pSystem[i][j].size = this.pSystem[i][j].size * this.decayRate;
          else
            this.pSystem[i][j].size = 10;
        } else
          this.pSystem[i][j].size = this.basePSize;
      }
    }
  }

  /**
   * class function modifyParticle manipulates the size and/or color of the particle
   * at index i, j in the particleSystem.
   * @param i: column of the particleSystem
   * @param j: row of the particleSystem
   * @param newSize: new size of the particle
   * @param newColor: default none, otherwise new color of particle
   *    in the form of a 3 length array holding rgb values.
   */
  modifyParticle(i, j, newSize, newColor = null) {
    //console.log("i:", i);
    //console.log("j:", j);
    let particle = this.pSystem[i][j];
    particle.size = newSize;
    if (newColor !== null) {
      particle.color = newColor;
    }
  }
}
