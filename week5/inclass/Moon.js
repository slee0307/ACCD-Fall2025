let earthImg, moonImg;
let startTime, delay = 3000;
let moonStarted = false;
let moonAngle = 0, earthAngle = 0;

function preload() {
  earthImg = loadImage("earth.jpg");
  moonImg  = loadImage("moon.png");
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-holder");
  imageMode(CENTER);
  noStroke();
  startTime = millis();
}

function draw() {
  background(5, 5, 20);

  translate(width / 2, height / 2);
  const rBase = min(width, height) * 0.18;
  const rMoon = rBase * 0.65;

  const earthX = cos(earthAngle) * rBase;
  const earthY = sin(earthAngle) * rBase;

  push();
  rotate(earthAngle * 2);
  image(earthImg, earthX, earthY, rBase * 1.1, rBase * 1.1);
  pop();

  earthAngle += 0.004;

  if (millis() - startTime > delay) moonStarted = true;

  if (moonStarted) {
    const moonX = earthX + cos(moonAngle) * rMoon * 0.7;
    const moonY = earthY + sin(moonAngle) * rMoon * 0.7;
    image(moonImg, moonX, moonY, rBase * 0.45, rBase * 0.45);
    moonAngle += 0.015;
  }

  // 별
  for (let i = 0; i < 3; i++) {
    fill(255, random(150, 255));
    ellipse(random(-width/2, width/2), random(-height/2, height/2), random(1, 3));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
