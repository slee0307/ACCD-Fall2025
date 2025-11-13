let handPose;
let video;
let hands = [];

let thumbTip, indexTip;

let umbrellaImg;
let rainImg;

let umbrella = { x: 0, y: 0, w: 300, h: 300 };

let raindrops = [];
let numRain = 20; // 전체 화면이니까 비도 더 많이!

function preload() {
  handPose = ml5.handPose({ flipped: true });

  umbrellaImg = loadImage("assets/umbrella.png");
  rainImg = loadImage("assets/raindrop.png");
}

function setup() {
  // 🔥 1) 캔버스 생성 (단 한 번!)
  let canvas = createCanvas(windowWidth, windowHeight * 0.7);
  canvas.parent("canvas-holder");    // 🔥 HTML div 안에 삽입

  // 🔥 2) 웹캠 설정
  video = createCapture(VIDEO, { flipped: true });
  video.size(windowWidth, windowHeight * 0.7);
  video.hide();

  // 🔥 3) 비 생성
  for (let i = 0; i < numRain; i++) {
    raindrops.push(createRaindrop());
  }

  // 🔥 4) ML5 HandPose 시작
  handPose.detectStart(video, gotHands);
}


function draw() {
  background(200);

  // Webcam full screen
  image(video, 0, 0, windowWidth, windowHeight);

  // --- Umbrella Tracking (if hand exists) ---
  if (hands.length > 0) {
    let umbrellaX = (thumbTip.x + indexTip.x) / 2;
    let umbrellaY = (thumbTip.y + indexTip.y) / 2;

    umbrella.x = umbrellaX - umbrella.w / 2;
    umbrella.y = umbrellaY - umbrella.h / 2;

    image(umbrellaImg, umbrella.x, umbrella.y, umbrella.w, umbrella.h);
  }

  // --- Rain Loop ---
  for (let r of raindrops) {
    r.pos.add(r.vel);

    // Respawn rain at top after falling
    if (r.pos.y > height) {
      r.pos.y = -20;
      r.pos.x = random(width);
    }

    // Umbrella collision (only if hand detected)
    if (hands.length > 0) {
      if (
        r.pos.x > umbrella.x &&
        r.pos.x < umbrella.x + umbrella.w &&
        r.pos.y > umbrella.y &&
        r.pos.y < umbrella.y + umbrella.h
      ) {
        // Make rain bounce back up
        r.vel.y = -abs(r.vel.y);
        r.pos.y = umbrella.y - 10;
      }
    }

    image(rainImg, r.pos.x, r.pos.y, 30, 40);
  }
}

// --- Create Raindrop Function ---
function createRaindrop() {
  return {
    pos: createVector(random(width), random(-400, 0)),
    vel: createVector(0, random(3, 7)),
    radius: 10,
  };
}

// --- Handpose results ---
function gotHands(results) {
  hands = results;

  if (hands.length > 0) {
    thumbTip = hands[0].thumb_tip;
    indexTip = hands[0].index_finger_tip;
  }
}

// --- Resize canvas when window size changes ---
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Resize video too
  video.size(windowWidth, windowHeight);
}
