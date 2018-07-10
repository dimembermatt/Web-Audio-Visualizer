let context = new (window.AudioContext || window.webkitAudioContext)();
const mastergain = context.createGain();
const analyser = context.createAnalyser();
let src = context.createBufferSource();
// Connect audio nodes form src to dest
src.connect(mastergain);
mastergain.connect(analyser);
analyser.connect(context.destination);



// Get the audio src
/*
Might take a while to load audio
*/
let request = new XMLHttpRequest();
request.open('GET', 'reaperslineofsight.mp3', true);
request.responseType = 'arraybuffer';

request.onload = function() {
    let data = request.response;
    context.decodeAudioData(data, function(buffer){
        src.buffer = buffer;
        src.loop = false;
    }, (e) => console.log("Error with decoding audio data" + e));
}
request.send();
src.start(0);
// Add the audio time domain data
const waves = new Float32Array(analyser.frequencyBinCount);
analyser.getFloatTimeDomainData(waves);

(function updateWaves() {
    requestAnimationFrame(updateWaves);
    analyser.getFloatTimeDomainData(waves);
})();

const canvas = document.getElementById('scope');
canvas.width = waves.length;
canvas.height = 300;
const canvasContext = canvas.getContext('2d');

(function drawScope(){
    requestAnimationFrame(drawScope);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.beginPath();
    for(let i = 0; i < waves.length; i++) {
        const x = i;
        const y = (0.5 + waves[i]/3) * canvas.height;
        if(i == 0) {
            canvasContext.moveTo(x, y);
        }
        else {
            canvasContext.lineTo(x, y);
        }
    }
    canvasContext.stroke();
})();
