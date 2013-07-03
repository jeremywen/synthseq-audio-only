var bpm = 128;
var maxCols = 8;
var maxRows = 11;
var blocks = [];
var visibleGrid = 0;
var controlRowCount = 2;
var ua = navigator.userAgent;
var isFirefoxOS = ua.contains("Firefox") && ua.contains("Mobile");

function rn(low,high){
  if(high){
    return Math.floor(Math.random() * (high-low)) + low;
  }
  return Math.floor(Math.random()*low);
}

///////////////////////////////////////////////////////////////////////////////////////////////
// audio
///////////////////////////////////////////////////////////////////////////////////////////////
sc.use("prototype");   
timbre.setup({f64:true});
console.log("timbre.samplerate = ",timbre.samplerate);

if (isFirefoxOS) { 
  // bpm = 60;
  timbre.setup({samplerate:timbre.samplerate * 0.5}); 
  console.log("reduced timbre.samplerate = ",timbre.samplerate);
}

function runSequencer(){
  var scale = new sc.Scale.minor();
  var env = T("perc", {r:75});
  var arp  = T("OscGen", {env:env, wave:"sin(15)", mul:0.5});
  arp.play();

  T("interval", {interval:"BPM" + bpm + " L16"}, function(count) {
    var col = count % maxCols;
    var height = rn(0,12);
    var heightOctave = Math.floor(height / scale.size());
    var noteNum = scale.wrapAt(height) + 48 + (12*heightOctave);
    arp.noteOn(noteNum + 12, 60);
  }).start();
}

var onreset = function() {};
timbre.on("play", function(){});
timbre.on("pause", onreset);
timbre.on("reset", onreset);
timbre.amp = 0.7;

function playStopSequencer() {
  if (timbre.isPlaying) {
      timbre.reset();
      timbre.pause();
  } else {
      timbre.reset();
      runSequencer();
  }
}

playStopSequencer()