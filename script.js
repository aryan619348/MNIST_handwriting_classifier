var canvas, ctx, saveButton, clearButton;
var pos = {x:0, y:0};
var rawImage;
var model;

function setPosition(e){
  pos.x = e.clientX-100;
  pos.y = e.clientY-100;
}
    
function draw(e) {
  if(e.buttons!=1) return;
  ctx.beginPath();
  ctx.lineWidth = 24;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'white';
  ctx.moveTo(pos.x, pos.y);
  setPosition(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  rawImage.src = canvas.toDataURL('image/png');
}
    
function erase() {
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,280,280);
}


function save() {
  var raw = tf.browser.fromPixels(rawImage,1);
  var resized = tf.image.resizeBilinear(raw, [28,28]);
  var tensor = resized.expandDims(0);
  var prediction = model.predict(tensor);
  var pIndex = tf.argMax(prediction, 1).dataSync();
  
  alert(pIndex);
}
    
function init() {
  canvas = document.getElementById('canvas');
  rawImage = document.getElementById('canvasimg');
  ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,280,280);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mousedown", setPosition);
  canvas.addEventListener("mouseenter", setPosition);
  saveButton = document.getElementById('sb');
  saveButton.addEventListener("click", save);
  clearButton = document.getElementById('cb');
  clearButton.addEventListener("click", erase);
}

async function run() {  
  model = await tf.loadLayersModel('model/model.json')
  tfvis.show.modelSummary({name: 'Model Architecture'}, model);
  init();
  alert("Classifying your handwriting!");
}
run();
