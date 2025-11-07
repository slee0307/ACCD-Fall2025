let bees = [];
let flowers = [];
let wind;
let weather;

// 🌤️ 슬라이더 변수
let windStrengthSlider;
let flowerCountSlider;

function setup() {
  // 🖼️ 캔버스를 HTML 아래로 보내되, 마우스 이벤트는 통과되게
  let canvas = createCanvas(windowWidth * 0.8, windowHeight * 0.8);
  canvas.position(0, 0);
  canvas.style('position', 'absolute');
  canvas.style('z-index', '-1'); // ← 캔버스를 맨 아래로 보내기
  canvas.style('pointer-events', 'auto'); // ← 마우스 이벤트 인식 가능


  // 🌿 시스템 초기화
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

  // 🐝 소제목 (제목 아래)
  let subtitle = createP("🐝 Bees move naturally following wind and flowers.");
  subtitle.position(35, 90); // 제목보다 더 아래로 이동
  subtitle.style("color", "#cccccc");
  subtitle.style("font-size", "13px");
  subtitle.style("font-family", "Arial");
  subtitle.style("margin", "0");

  // 🌬️ 왼쪽 슬라이더 (바람 세기)
windStrengthSlider = createSlider(0, 1, 0.4, 0.01);
windStrengthSlider.position(35, height + 80);
windStrengthSlider.style("width", "200px");

// 🌸 오른쪽 슬라이더 (꽃 개수)
flowerCountSlider = createSlider(10, 40, 20, 1);
flowerCountSlider.position(285, height + 80);
flowerCountSlider.style("width", "200px");

// 🌬️ 왼쪽 슬라이더 위 설명 (두 줄)
let windLabelTop = createP("💨 Drag to change wind direction.<br>🌬️ Left slider adjusts wind strength.");
windLabelTop.position(35, height + 40); // ← 슬라이더 위로 올림
windLabelTop.style("color", "#aaa");
windLabelTop.style("font-size", "12px");
windLabelTop.style("font-family", "Arial");
windLabelTop.style("margin", "0");
windLabelTop.style("line-height", "1.4");

// 🌸 오른쪽 슬라이더 위 설명 (한 줄)
let flowerLabelTop = createP("🌸 Right slider changes flower count.");
flowerLabelTop.position(285, height + 60); // ← 오른쪽 슬라이더 위로
flowerLabelTop.style("color", "#aaa");
flowerLabelTop.style("font-size", "12px");
flowerLabelTop.style("font-family", "Arial");
flowerLabelTop.style("margin", "0");

// 🧾 Bee & Flower 카운트 표시 (HTML로 생성)
let countLabel = createP(`🐝 Bees: ${bees.length}    🌸 Flowers: ${flowers.length}`);
countLabel.position(35, height + 120); // 슬라이더 바로 밑
countLabel.style("color", "#ccc");
countLabel.style("font-size", "13px");
countLabel.style("font-family", "Arial");
countLabel.style("margin", "0");

// draw() 안에서 갱신되도록 전역 변수로 유지
window.countLabel = countLabel;

  textFont("Arial");
  
}

function draw() {
  background(20);

  // 🌬️ 슬라이더 값 반영
  wind.strength = windStrengthSlider.value();

  // 🌸 꽃 개수 조정
  let desiredCount = flowerCountSlider.value();
  while (flowers.length < desiredCount) {
    flowers.push(new Flower(random(width), random(height)));
  }
  while (flowers.length > desiredCount) {
    flowers.pop();
  }

  // 🌤️ 환경 업데이트
  weather.tick();

  // 🌸 꽃 업데이트
  for (let f of flowers) {
    f.refill(0.001);
    f.display();
  }

  // 🐝 벌 업데이트
  for (let b of bees) {
    b.update(flowers);
    if (b.target) b.visit(b.target);
    b.display();
  }

  // 🌬️ 바람 시각화
  stroke(80);
  for (let x = 0; x < width; x += 50) {
    for (let y = 0; y < height; y += 50) {
      let wv = wind.sample(x, y);
      line(x, y, x + wv.x * 20, y + wv.y * 20);
    }
  }
// 🧾 정보 표시 (슬라이더 밑 중앙 정렬)
noStroke();
fill(200);
textSize(13);
textAlign(CENTER);
text(
  `🐝 Bees: ${bees.length}    🌸 Flowers: ${flowers.length}`,
  width / 2,  // 화면 가운데
  height + 110 // 슬라이더 바로 밑 (브라우저에 따라 잘 안 보이면 115~120으로 조정)
);


}
// 🧾 Bee & Flower 카운트 업데이트
countLabel.html(`🐝 Bees: ${bees.length}    🌸 Flowers: ${flowers.length}`);


// 🖱️ 드래그로 바람 방향 바꾸기
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

function mouseDragged() {
  if (!dragStart) return;
  const dragEnd = createVector(mouseX, mouseY);
  wind.setFromDrag(dragStart, dragEnd); // 실시간 방향 갱신
}

