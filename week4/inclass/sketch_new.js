let bgImg;
let natureSound;
let t = 0;
let soundStarted = false;

function preload() {
  bgImg = loadImage('assets/cloud.jpg');
  natureSound = loadSound('assets/nature.mp3');
}

function setup() {
  // 캔버스를 특정 div에 붙이기 (글 위로 덮지 않게!)
  let canvas = createCanvas(windowWidth * 0.6, windowHeight * 0.4);
  canvas.parent("cloudCanvas");

  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(18);
  fill(80);
  text("Click to start sound 🌿", width / 2, height / 2);
}

function draw() {
  if (!soundStarted) return;

  background(255);

  // 구름의 자연스러운 움직임 (noise 기반)
  let moveX = noise(t) * width - width / 2;
  let moveY = noise(t + 100) * height - height / 2;

  // 구름 속도 조금 빠르게 (0.008)
  let scaleAmount = 1.05 + sin(t * 2) * 0.02;

  push();
  translate(width / 2 + moveX, height / 2 + moveY);
  scale(scaleAmount);
  image(bgImg, 0, 0, width * 1.3, height * 1.3);
  pop();

  t += 0.008; // 속도 ↑
}

function mousePressed() {
  if (!soundStarted && natureSound.isLoaded()) {
    natureSound.loop();
    soundStarted = true;
  }
}

function windowResized() {
  resizeCanvas(windowWidth * 0.6, windowHeight * 0.4);
}
