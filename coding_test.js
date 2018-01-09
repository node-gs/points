
class PointMatrix {
  
  constructor(){
    this.numberOfPoints = 100;
    this.rowSize = 1000 + 1;
    this.coordinateSize = this.rowSize * this.rowSize;
  }

  getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  setRandomPoints() {
    let randomPoints = Array(this.coordinateSize).fill(0);

    for (let i = 0; i <= this.numberOfPoints; i++) {
      randomPoints[this.getRandomInt(0, this.coordinateSize)] = 1;
    }
    return randomPoints.slice();
  }
  setXMatricies(x) {
    let pointMatrixContainer = [];
    for ( let i = 0; i < x; i++) {
      pointMatrixContainer.push(this.setRandomPoints());
    }
    return pointMatrixContainer;
  }

}

class CircleMatrix {

  constructor() {
    this.circleDiameter = 900;
    this.circleRadius = this.circleDiameter / 2;
    this.allPointArray = [];
    this.rowSize = 1000 + 1;
    this.midPoint = (this.rowSize - 1)/2;
    this.outerRow = [];
  }
  // vertical radius from of circle from center
  verticalRadius(i) { 
    return Math.abs(this.rowSize/2 - i);
  }

  // horizontal radius from of circle from center
  horizontalRadius(i) { 
    return (Math.sqrt(Math.pow(this.circleRadius, 2) - Math.pow(this.verticalRadius(i), 2)));
  }

  createPoints(){
    
    for (let i = 0; i < this.rowSize; i++) {
      
      let minPoint, maxPoint;

      if (this.verticalRadius(i) > this.circleRadius) {
        minPoint = this.rowSize;
        maxPoint = 0;
      } else {
        minPoint = this.midPoint - this.horizontalRadius(i);
        maxPoint = this.midPoint + this.horizontalRadius(i);
      }
      this.allPointArray.push([minPoint, maxPoint])
    }
    return this.createSphere();
  }
  // returns one circle row
  calculateSliceOfCircle() {
    let row = Array(this.rowSize).fill(0);
    let circumference = this.allPointArray.shift();
    return row.map((val, index) => {
      // make ternary
      if (index > circumference[0] && index < circumference[1]) {
        return 1;
      } else {
        return 0;
      }
    })
  }

  createSphere() {
    while (this.allPointArray.length) {
      this.outerRow = [...this.outerRow, ...this.calculateSliceOfCircle()];
    }
    return this.outerRow;
  }
}

class Counter {
  
  constructor(pointMatrix, circleMatrix) {
    this.pointMatrix = pointMatrix;
    this.circleMatrix = circleMatrix;
    this.numberOfPoints = 100;
    this.rowSize = 1000;
    this.count = 0;
    this.percentInCircle;
    this.areaOfCircle;
    this.PI;
    this.circleRadius = 450;
    this.calculate();
  }
  calculate() {
    this.countPointsInCircle();
    this.calculatePercentInCircle();
    this.calculateAreaOfCircle();
    this.calculatePI();
  }
  countPointsInCircle() {
    if (this.pointMatrix.length === this.circleMatrix.length) {
      this.pointMatrix.forEach((val, index) => {
        if (val === 0)
          return;
        else if (this.circleMatrix[index] === val)
          this.count++;
        })
    }
  }
  calculatePercentInCircle() {
    this.percentInCircle = this.count / this.numberOfPoints;
  }
  calculateAreaOfCircle() {
    this.areaOfCircle = this.percentInCircle * (this.rowSize * this.rowSize);
  }

  calculatePI() {
    this.PI = this.areaOfCircle * (1 / this.circleRadius) * (1 / this.circleRadius);
  }

}

(() => {

  let pointMatrix = new PointMatrix(),
    circleMatrix = new CircleMatrix(),
    results = [],
    pointMatricies,
    total,
    PI;

  circleMatrix = circleMatrix.createPoints();

  pointMatricies = pointMatrix.setXMatricies(10);

  pointMatricies.forEach((val)=>{
    results.push(new Counter(val, circleMatrix));
  })

  total = results
    .map((val)=> val.PI)
    .reduce((a, b) => a + b);

  PI = total / results.length;

  console.log('Average of PI over 10 samples:', PI);
})();
