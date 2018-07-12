let context = new (window.AudioContext || window.webkitAudioContext)();
let play = document.getElementById('play');
let stop = document.getElementById('stop');
let src;
let loaded = false;
let beatFound = false;
// Webaudio setup
const mastergain = context.createGain();
const analyser = context.createAnalyser();
const analyser2 = context.createAnalyser();
analyser2.fftSize = 32768;
const filter = context.createBiquadFilter();
// Connect audio nodes form src to dest
mastergain.connect(analyser);
analyser.connect(context.destination);
mastergain.connect(filter);
filter.connect(analyser2);
//set filter settings
filter.type = 'lowpass';
filter.frequency.value = 200;
filter.gain.value = 10;

function getFile() {
        src = context.createBufferSource()
        // Load a file from the file input
        let selectedFile = document.getElementById('fileIn').files[0];
        let reader = new FileReader();
        // Create an HTTP request to get the file
        let request = new XMLHttpRequest();
        // Error - File not found!
        if(!selectedFile) {
            alert("Select a file!")
        }
        else {
            reader.onload = function() {
                let data = reader.result;
                    context.decodeAudioData(data, function(buffer){
                    src.buffer = buffer;
                    src.loop = false;
                    src.connect(mastergain);
                    src.start(0);
                    loaded = true;
                    beatFound = false;
                    src.onended = function() {
                        play.removeAttribute('disabled');
                        loaded = false;
                    }
                }, (e) => console.log("Error with decoding audio data" + e));
            }
            reader.readAsArrayBuffer(selectedFile);
        }
        return !!selectedFile;
}

function playSong() {
    let fileFound = getFile();

    // Only disable the play button if a file is found
    if (fileFound){
        play.setAttribute('disabled', 'disabled');
    }
}


function stopSong() {
    src.stop(0);
    play.removeAttribute('disabled');
}
