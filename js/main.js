var analyzer, canvas, context, random = Math.random, circles = [];

window.onload = function () {
    canvas = this.document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.document.body.appendChild(canvas);
    context = canvas.getContext('2d');

    for (var i = 0; i < 20; i++) { 
        circles[i] = new Circle();
        circles[i].draw();
    }
    setup();
    draw();
}

function setup() {
    var audio = document.createElement('audio')
    audio.src = 'music.mp3';
    audio.controls = true;
    document.body.appendChild(audio);
    audio.style.width = window.innerWidth + 'px';
    
    var audioContext = new AudioContext();
    analyzer = audioContext.createAnalyser();
    var source = audioContext.createMediaElementSource(audio);
    source.connect(analyzer);
    analyzer.connect(audioContext.destination);
    audio.play();
}

function draw() {
    requestAnimationFrame(draw);
    var freqByteData = new Uint8Array(analyzer.frequencyBinCount);
    analyzer.getByteFrequencyData(freqByteData);
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 1; i < circles.length; i++) {
        circles[i].radius = freqByteData[i] * 2;
        circles[i].y = circles[i].y > canvas.height ? 0 : circles[i].y + 1;
        circles[i].draw();
    }

    for(var i = 1; i < freqByteData.length; i +=10) {
        context.fillStyle = 'rgb(' + getRandomColor() + ',' + getRandomColor() + ',' + getRandomColor() + ')';
        context.fillRect(i + 300, canvas.height - freqByteData[i] * 1.5, 10, canvas.height);
        context.strokeRect(i + 300, canvas.height - freqByteData[i] *   1.5, 10, canvas.height);

    }
}

function getRandomColor() {
    return random() * 255 >> 0;
}

function Circle() {
    this.x = random() * canvas.width;
    this.y = random() * canvas.height;
    this.radius = random() * 100 + 50;
    this.color = 'rgb(' + getRandomColor() + ',' + getRandomColor() + ',' + getRandomColor() + ')';
}

Circle.prototype.draw = function () {
    var that = this; 
    context.save();
    context.beginPath();
    context.globalAlpha = random() / 3 + 0.2;
    context.arc(that.x, that.y, that.radius, 0, Math.PI*2);
    context.fillStyle = this.color;
    context.fill();
    context.restore();
}