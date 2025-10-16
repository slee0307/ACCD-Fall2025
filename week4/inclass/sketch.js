let bgImg;
let natureSound;
let t = 0;
let soundStarted = false;

function preload() {
  bgImg = loadImage('assets/cloud.jpg');
  natureSound = loadSound('assets/nature.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  noStroke();

  textAlign(CENTER, CENTER);
  textSize(24);
  fill(0);
  text("Click anywhere to start sound 🌿", width / 2, height / 2);
}

function draw() {
  if (!soundStarted) return;

  // 🌈 낮 → 석양 → 밤 → 낮 순환 (밝은 하늘로 시작)
  // dayCycle은 여전히 하늘색용으로 사용
  let dayCycle = (sin(t * 0.5 - HALF_PI) + 1) / 2;

  // 하늘색: 낮은 밝고, 밤은 어둡게
  let skyR = lerp(135, 5, dayCycle);
  let skyG = lerp(206, 10, dayCycle);
  let skyB = lerp(235, 30, dayCycle);
  background(skyR, skyG, skyB);

  // 🌫️ 구름 움직임
  let moveX = noise(t) * width - width / 2;
  let moveY = noise(t + 100) * height - height / 2;

  // 구름 밝기와 투명도 (밤에는 어둡게)
  let scaleAmount = 1.05 + sin(t * 0.5) * 0.03;
  let cloudBrightness = lerp(255, 100, dayCycle);
  let alpha = lerp(255, 150, dayCycle);

  push();
  translate(width / 2 + moveX, height / 2 + moveY);
  scale(scaleAmount);
  tint(cloudBrightness, alpha);
  image(bgImg, 0, 0, width * 1.2, height * 1.2);
  pop();

  // 🌙 밤 어두움 레이어
  if (dayCycle > 0.6) {
    fill(0, (dayCycle - 0.6) * 200);
    rect(0, 0, width, height);
  }

  // 🕒 시계 아이콘 (항상 시계방향 회전)
  drawClockIcon(t);

  t += 0.002;
}

// 🕒 시계 아이콘 함수 (계속 시계방향 회전)
function drawClockIcon(timeValue) {
  push();
  translate(70, 70); // 시계 위치
  noFill();
  stroke(255);
  strokeWeight(2);
  ellipse(0, 0, 40); // 시계 테두리

  // 바늘 회전 (t 기반으로 지속 회전)
  let angle = (timeValue * 0.5) % TWO_PI; // 계속 회전 (시계방향)
  let handLength = 15;

  stroke(255);
  strokeWeight(3);
  line(0, 0, cos(angle - HALF_PI) * handLength, sin(angle - HALF_PI) * handLength);
  pop();
}

function mousePressed() {
  if (!soundStarted && natureSound.isLoaded()) {
    natureSound.loop();
    natureSound.setVolume(0.5);
    soundStarted = true;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
