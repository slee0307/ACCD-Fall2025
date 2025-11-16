let handPose;
let video;
let hands = [];

let thumbTip, indexTip;

let umbrellaImg;
let rainImg;

let mySound;       // 배경 음악
let dropSound;     // 💧 효과음

let umbrella = { x: 0, y: 0, w: 300, h: 300 };

let raindrops = [];
let numRain = 20;  // 기본값

let rainSlider;    // 🌧 슬라이더 값


function preload() {
  handPose = ml5.handPose({ flipped: true });

  umbrellaImg = loadImage("assets/umbrella.png");
  rainImg = loadImage("assets/raindrop.png");

  // 🎵 사운드
  soundFormats("mp3", "wav", "ogg");
  mySound = loadSound("assets/music.mp3");
  dropSound = loadSound("assets/hit.mp3");
  dropSound.setVolume(0.3);
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight * 0.7);
  canvas.parent("canvas-holder");

  video = createCapture(VIDEO, { flipped: true });
  video.size(windowWidth, windowHeight * 0.7);
  video.hide();

  for (let i = 0; i < numRain; i++) {
    raindrops.push(createRaindrop());
  }

  handPose.detectStart(video, gotHands);

  // 🔊 버튼 — 클릭하면 사운드 ON/OFF
const soundBtn = document.getElementById("sound-btn");
soundBtn.addEventListener("click", () => {
  userStartAudio();

  if (mySound.isPlaying()) {
    mySound.stop();  
    soundBtn.innerText = "Turn On Sound 🎧";
  } else {
    mySound.play();
    soundBtn.innerText = "Turn Off Sound 🔇";
  }
});
 // 🌧 슬라이더 연결 ← 이것 때문에 화면이 안 나왔음!
  rainSlider = document.getElementById("rain-slider");
}



function draw() {
  background(200);

  let videoHeight = windowHeight * 0.7;
  image(video, 0, 0, windowWidth, videoHeight);

  // 🌧 슬라이더로 비 양 조절
  let targetRain = parseInt(rainSlider.value);

  // 비 양 업데이트
  while (raindrops.length < targetRain) {
    raindrops.push(createRaindrop());
  }
  while (raindrops.length > targetRain) {
    raindrops.pop();
  }

  // --- Umbrella tracking ---
  if (hands.length > 0) {
    let umbrellaX = (thumbTip.x + indexTip.x) / 2;
    let umbrellaY = (thumbTip.y + indexTip.y) / 2;

    umbrella.x = umbrellaX - umbrella.w / 2;
    umbrella.y = umbrellaY - umbrella.h / 2;

    image(umbrellaImg, umbrella.x, umbrella.y, umbrella.w, umbrella.h);
  }

  // --- Rain Loop ---
  for (let r of raindrops) {
    // 중력 효과
    r.vel.y += 0.2;
    if (r.vel.y > 7) r.vel.y = 7;

    r.pos.add(r.vel);

    // 화면 아래 넘어가면 다시 위로
    if (r.pos.y > videoHeight) {
      r.pos.y = -20;
      r.pos.x = random(width);
      r.vel.y = random(3, 7);
    }

    // 우산 충돌
    if (
      hands.length > 0 &&
      r.pos.x > umbrella.x &&
      r.pos.x < umbrella.x + umbrella.w &&
      r.pos.y > umbrella.y &&
      r.pos.y < umbrella.y + umbrella.h
    ) {
      r.vel.y = -random(2, 4);
      r.pos.y = umbrella.y - 5;

      if (!dropSound.isPlaying()) dropSound.play();
    }

    image(rainImg, r.pos.x, r.pos.y, 30, 40);
  }
}


function createRaindrop() {
  return {
    pos: createVector(random(width), random(-400, 0)),
    vel: createVector(0, random(3, 7)),
  };
}

function gotHands(results) {
  hands = results;

  if (hands.length > 0) {
    thumbTip = hands[0].thumb_tip;
    indexTip = hands[0].index_finger_tip;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight * 0.7);
  video.size(windowWidth, windowHeight * 0.7);
}
