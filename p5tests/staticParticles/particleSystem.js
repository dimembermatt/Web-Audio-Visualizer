/**
 * function create2dArray establishes a new array organized based on input
 * @param columns: number of columns
 * @param rows: number of rows
 * @return reference to the created array
 */
function create2dArray(columns, rows) {
  var arr = new Array(columns);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
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
    this.color = [random(0, 255), random(0, 255), random(0, 255)];
    this.alpha = 255;
  }
}

class ParticleSystem {
  /**
   * class function constructor creates a 2d array of particles
   * @param columns: # of columns of the particleSystem
   * @param rows: # of rows of the particleSystem
   * @param basePSize: initial size of particles and minimum size
   * @param decayRate: how fast particles shrink over time
   * the color of each particle in the system is set at random on initialization.
   */
  constructor(columns, rows, basePSize, decayRate) {
    this.columns = columns;
    this.rows = rows;
    this.decayRate = decayRate;
    this.basePSize = basePSize;
    this.pSystem = create2dArray(columns, rows);
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        this.pSystem[i][j] = new Particle(basePSize);
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
    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
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
    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
        let sum = 0;
        let count = 1;
        //take the average of the surrounding 4 cells to calculate new size
        //check left and right cells first, if they exist
          // if (i == 0) {//if leftmost column
          //   sum += this.pSystem[i + 1][j].size;
          // } else if (i == this.columns-1) {//if rightmost column
          //   sum += this.pSystem[i - 1][j].size;
          // } else {//if neither of the above
          //   sum += this.pSystem[i + 1][j].size;
          //   sum += this.pSystem[i - 1][j].size;
          //   count ++;
          // }
          //
          // //check up and down cells next, if they exist
          // if (j == 0) { //if topmost row
          //   sum += this.pSystem[i][j + 1].size;
          // } else if (j == this.rows-1) { //if bottom most row
          //   sum += this.pSystem[i][j - 1].size;
          // } else {//if neither of the above
          //   sum += this.pSystem[i][j + 1].size;
          //   sum += this.pSystem[i][j - 1].size;
          //   count ++;
          // }
        if ((0 < i && i < this.columns - 1) && (0 < j && j < this.rows - 1)) {
          sum += this.pSystem[i - 1][j - 1].size;   //top left
          sum += this.pSystem[i - 1][j + 1].size;   //bottom left
          sum += this.pSystem[i + 1][j - 1].size;   //top right
          sum += this.pSystem[i + 1][j + 1].size;   //bottom right
          sum += this.pSystem[i][j + 1].size;       //down
          sum += this.pSystem[i][j - 1].size;       //up
          sum += this.pSystem[i + 1][j].size;       //right
          sum += this.pSystem[i - 1][j].size;       //left
          count += 8;
        } else if (i === 0) {
          if (j === 0) { //top left corner
            sum += this.pSystem[i][j + 1].size;     //down
            sum += this.pSystem[i + 1][j].size;     //right
            sum += this.pSystem[i + 1][j + 1].size; //bottom right
            count += 3;
          } else if (j === this.rows - 1) {//bottom left corner
            sum += this.pSystem[i][j - 1].size;     //up
            sum += this.pSystem[i + 1][j].size;     //right
            sum += this.pSystem[i + 1][j - 1].size; //top right
            count += 3;
          } else {//leftmost column
            sum += this.pSystem[i][j + 1].size;     //down
            sum += this.pSystem[i][j - 1].size;     //up
            sum += this.pSystem[i + 1][j].size;     //right
            sum += this.pSystem[i + 1][j - 1].size; //top right
            sum += this.pSystem[i + 1][j + 1].size; //bottom right
            count += 5;
          }
        } else {
          if (j === 0) { //top right corner
            sum += this.pSystem[i][j + 1].size;     //down
            sum += this.pSystem[i - 1][j].size;     //left
            sum += this.pSystem[i - 1][j + 1].size; //bottom left
            count += 3;
          } else if (j === this.rows - 1) { //bottom right corner
            sum += this.pSystem[i][j - 1].size;     //up
            sum += this.pSystem[i - 1][j].size;     //left
            sum += this.pSystem[i - 1][j - 1].size; //top left
            count += 3;
          } else { //rightmost column
            sum += this.pSystem[i][j + 1].size;     //down
            sum += this.pSystem[i][j - 1].size;     //up
            sum += this.pSystem[i - 1][j].size;     //left
            sum += this.pSystem[i - 1][j - 1].size; //top left
            sum += this.pSystem[i - 1][j + 1].size; //bottom left
            count += 5;
          }
        }


        sum += this.pSystem[i][j].size;
        let weightedAvg = sum/count;
        this.pSystem[i][j].size = weightedAvg * this.decayRate <= this.basePSize ? this.basePSize : weightedAvg * this.decayRate;
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
