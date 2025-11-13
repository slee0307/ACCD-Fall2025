// ───────────────────────────
// 🌾 Synthetic Meadow – main sketch
// ───────────────────────────

// 전역 변수
let bees = [];
let flowers = [];
let seeds = [];
let wind;
let weather;

// 🌬️ 슬라이더 변수
let windStrengthSlider;
let flowerCountSlider;

// 🌿 설명 라벨
let windLabel;
let flowerLabel;

function setup() {
  // 🌸 캔버스 생성 및 컨테이너 설정
  const container = select("#sketch-container");
  let canvas = createCanvas(windowWidth * 0.8, windowHeight * 0.6);
  canvas.parent(container);
  textFont("Arial");

  // 🌬️ 시스템 초기화
  wind = new Wind();
  weather = new Weather();

  // 🐝 벌 생성
  for (let i = 0; i < 10; i++) {
    bees.push(new Bee(random(width), random(height)));
  }

  // 🌸 꽃 생성
  for (let i = 0; i < 20; i++) {
    flowers.push(new Flower(random(width), random(height)));
  }

  // 🌬️ 바람 세기 슬라이더 (왼쪽)
windStrengthSlider = createSlider(0, 1, 0.4, 0.01);
windStrengthSlider.parent(container);
windStrengthSlider.style("width", "250px");
windStrengthSlider.style("margin", "15px");

// 🌬️ 바람 슬라이더 설명 (바로 아래)
let windDragLabel = createP("💨 Drag to change wind direction.");
windDragLabel.parent(container);
windDragLabel.style("color", "#aaa");
windDragLabel.style("font-size", "13px");
windDragLabel.style("margin", "2px 0 0 5px");

windLabel = createP("🏳️‍🌬️ Adjusts wind strength.");
windLabel.parent(container);
windLabel.style("color", "#aaa");
windLabel.style("font-size", "13px");
windLabel.style("margin", "2px 0 20px 5px");

// 🌸 꽃 개수 슬라이더 (오른쪽)
flowerCountSlider = createSlider(10, 60, 20, 1);
flowerCountSlider.parent(container);
flowerCountSlider.style("width", "250px");
flowerCountSlider.style("margin", "10px 0 0 15px");

// 🌸 꽃 슬라이더 설명 (바로 아래)
flowerLabel = createP("🌸 Changes flower count.");
flowerLabel.parent(container);
flowerLabel.style("color", "#aaa");
flowerLabel.style("font-size", "13px");
flowerLabel.style("margin", "2px 0 15px 5px");
}

function draw() {
  background(20);

  // 🌤️ 날씨 업데이트
  weather.tick();

  // 🌬️ 슬라이더로 바람 세기 조절
  wind.strength = windStrengthSlider.value();

  // 🌸 꽃 개수 조절 (기본 밀도 유지)
  let desiredCount = flowerCountSlider.value();
  while (flowers.length < desiredCount) {
    flowers.push(new Flower(random(width), random(height)));
  }
  while (flowers.length > desiredCount + 200) { // 여유 공간 허용
    flowers.pop();
  }

  // 🌸 꽃 업데이트
  for (let f of flowers) {
    f.refill(0.001);
    f.display();
    f.spawnSeed(seeds); // 일정 수분 후 씨앗 생성
  }

  // 🌱 씨앗 업데이트
  for (let i = seeds.length - 1; i >= 0; i--) {
    seeds[i].update(flowers);
    seeds[i].display();
    if (!seeds[i].alive) seeds.splice(i, 1);
  }

  // 🐝 벌 이동 및 상호작용
  for (let b of bees) {
    b.update(flowers);
    if (b.target) b.visit(b.target, seeds); // 꽃 방문 시 씨앗 생성
    b.display();
  }

  // 🌬️ 바람 시각화 (배경 흐름선)
  stroke(80);
  for (let x = 0; x < width; x += 50) {
    for (let y = 0; y < height; y += 50) {
      let wv = wind.sample(x, y);
      line(x, y, x + wv.x * 20, y + wv.y * 20);
    }
  }

  // 🧾 정보 표시 (중앙 하단)
  noStroke();
  fill(200);
  textSize(13);
  textAlign(CENTER);
  text(`🐝 Bees: ${bees.length}   🌸 Flowers: ${flowers.length}   🌱 Seeds: ${seeds.length}`, width / 2, height - 10);
}

// ───────────────────────────
// 🖱️ 마우스 드래그로 바람 방향 변경
// ───────────────────────────
let dragStart = null;
function mousePressed() {
  dragStart = createVector(mouseX, mouseY);
}

function mouseReleased() {
  if (dragStart) {
    let dragEnd = createVector(mouseX, mouseY);
    wind.setFromDrag(dragStart, dragEnd);
  }
  dragStart = null;
}
