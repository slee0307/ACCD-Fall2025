// ───────────────────────────
// 1️⃣ Bee Class 🐝
// ───────────────────────────
class Bee {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.energy = 100;
    this.pollen = 0;
    this.target = null;
    this.visitingTime = 0;
  }

  // 가까운 꽃 찾기 (벌마다 랜덤 오프셋 부여)
  seekFlower(flowers) {
    let closest = null;
    let closestDist = Infinity;
    let offset = floor(random(0, flowers.length));

    for (let i = 0; i < flowers.length; i++) {
      let f = flowers[(i + offset) % flowers.length];
      let d = p5.Vector.dist(this.pos, f.pos);
      if (d < closestDist) {
        closestDist = d;
        closest = f;
      }
    }
    this.target = closest;
  }

  // 꽃 방문
visit(flower) {
  const d = p5.Vector.dist(this.pos, flower.pos);
  if (d < 10) {
    // 넥타 섭취
    let drink = min(flower.nectar, 0.02);
    flower.nectar -= drink;
    this.energy += drink * 100;

    this.pollen += 0.05;
    flower.pollenLoad += 0.05;
    if (flower.pollenLoad > 1) flower.pollinated = true;

    this.visitingTime++;

    // 방문 후 0.3초만 머무르기 (빨리 다음 꽃으로 이동)
    if (this.visitingTime > 18 || flower.nectar <= 0.2) {
      this.target = null;
      this.visitingTime = 0;
    }
  } else {
    this.visitingTime = 0;
  }
}

update(flowers) {
  this.energy -= 0.1;
  if (this.energy <= 0) {
    bees = bees.filter(b => b !== this);
    return;
  }

  if (!this.target || this.target.nectar <= 0) this.seekFlower(flowers);

  let dir = createVector(0, 0);
  if (this.target) {
    dir = p5.Vector.sub(this.target.pos, this.pos);
    dir.setMag(0.2); // 더 약하게 흡인
  }

  // 바람 영향
  const windForce = wind.sample(this.pos.x, this.pos.y).mult(0.18);

// 이동 벡터 업데이트 (회전 억제)
this.vel.lerp(dir, 0.1); // ← 방향을 천천히 보정 (핵심)
this.vel.add(windForce);
this.vel.add(p5.Vector.random2D().mult(0.05)); // 약간의 부유감


  // 🧠 핵심: damping (관성 줄이기)
  this.vel.mult(0.95);

  // 속도 제한
  this.vel.limit(2.0);

  this.pos.add(this.vel);
  this.wrap();
}


  wrap() {
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    const angle = this.vel.heading();
    rotate(angle + radians(10) * noise(frameCount * 0.01 + this.pos.x * 0.01));

    // 몸통
    noStroke();
    fill(255, 204, 0);
    ellipse(0, 0, 12, 8);

    // 검은 줄무늬
    fill(0);
    rect(-3, -4, 2, 8);
    rect(1, -4, 2, 8);

    // 날개 (반투명)
    fill(255, 255, 255, 160);
    ellipse(-3, -6, 6, 3);
    ellipse(3, -6, 6, 3);

    // 눈
    fill(0);
    ellipse(5, -1, 2, 2);

    pop();
  }
}


// ───────────────────────────
// 2️⃣ Flower Class 🌸
// ───────────────────────────
class Flower {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.nectar = random(0.5, 1.0);
    this.pollenLoad = 0;
    this.pollinated = false;
  }

  refill(rate = 0.001) {
    this.nectar = constrain(this.nectar + rate, 0, 1);
  }

  receivePollen(qty) {
    this.pollenLoad += qty;
    if (this.pollenLoad > 1) this.pollinated = true;
  }

  spawnSeed(weather, wind) {
    // 나중에 확장 가능 (씨앗 생성)
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();

    // 꽃잎 6개
    fill(108, 231, 161);
    for (let i = 0; i < 6; i++) {
      ellipse(0, 5, 8, 14);
      rotate(PI / 3);
    }

    // 중심 색상 (넥타 양에 따라 변화)
    let c = lerpColor(color(80, 120, 80), color(255, 240, 100), this.nectar);
    fill(c);
    circle(0, 0, 8);

    // 수분된 경우 강조 표시
    if (this.pollinated) {
      fill(255, 150, 200, 120);
      circle(0, 0, 12);
    }

    pop();
  }
}


// ───────────────────────────
// 3️⃣ Seed Class 🌱
// ───────────────────────────
class Seed {
  constructor(x, y, vx, vy) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.ttl = 300;
  }

  update() {
    this.pos.add(this.vel);
    this.ttl -= 1;
  }

  germinate(flowers) {
    if (this.ttl <= 0) {
      flowers.push(new Flower(this.pos.x, this.pos.y));
      seeds = seeds.filter(s => s !== this);
    }
  }

  display() {
    fill(172, 225, 255);
    noStroke();
    circle(this.pos.x, this.pos.y, 4);
  }
}


// ───────────────────────────
// 4️⃣ Weather Class ☁️
// ───────────────────────────
class Weather {
  constructor() {
    this.temperature = 22;
    this.stress = 0.0;
    this.nectarRefill = 0.3;
  }

  tick() {
    // 온도나 스트레스 변화를 시뮬레이션할 수 있음
    this.temperature += random(-0.1, 0.1);
    this.stress = constrain(this.stress + random(-0.01, 0.01), 0, 1);
  }
}


// ───────────────────────────
// 5️⃣ Wind Class 💨
// ───────────────────────────
class Wind {
  constructor() {
    this.dir = createVector(1, 0);
    this.strength = 0.4;
  }

  sample(x, y) {
    // 특정 위치에서의 바람 벡터 반환
    return p5.Vector.mult(this.dir, this.strength);
  }

  setFromDrag(a, b) {
    // 사용자가 드래그한 방향으로 바람 설정
    this.dir = p5.Vector.sub(b, a).normalize();
  }
}
