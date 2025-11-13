// ───────────────────────────
// 🌬️ Wind Class
// ───────────────────────────
class Wind {
  constructor() {
    this.dir = createVector(1, 0); // 초기 방향 (오른쪽)
    this.strength = 0.4;           // 바람 세기
  }

  // 현재 위치에서 바람 벡터 계산
  sample(x, y) {
    return p5.Vector.mult(this.dir, this.strength);
  }

  // 마우스 드래그로 방향 설정
  setFromDrag(start, end) {
    const diff = p5.Vector.sub(end, start);
    if (diff.mag() > 1) {
      this.dir = diff.normalize();
    }
  }
}

// ───────────────────────────
// 🌤️ Weather Class
// ───────────────────────────
class Weather {
  constructor() {
    this.t = 0;
    this.humidity = 0.5;
  }

  tick() {
    this.t += 0.01;
    this.humidity = 0.5 + 0.5 * sin(this.t * 0.3);
  }
}

// ───────────────────────────
// 🌸 Flower Class
// ───────────────────────────
class Flower {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.nectar = random(0.5, 1.0);
    this.pollinated = 0;
    this.seeded = false;
  }

  refill(rate = 0.001) {
    this.nectar = constrain(this.nectar + rate, 0, 1);
  }

  receivePollen(qty = 1) {
    this.pollinated += qty;
  }

  spawnSeed(seeds) {
    // 일정 수분량이 쌓이면 주변에 씨앗 생성
    if (!this.seeded && this.pollinated >= 3) {
      const jitter = p5.Vector.random2D().mult(random(10, 25));
      seeds.push(new Seed(this.pos.x + jitter.x, this.pos.y + jitter.y));
      this.seeded = true;
    }
  }

  display() {
  push();
  translate(this.pos.x, this.pos.y);
  noStroke();

  // 꽃잎 색상 (수분 정도에 따라 변함)
  let petalColor = color(100, 180 + this.pollinated * 20, 255);
  fill(petalColor);

  // 🌸 꽃잎 6장 (회전시켜 배치)
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let px = cos(angle) * 5;
    let py = sin(angle) * 5;
    ellipse(px, py, 6, 10);
  }

  // 🌼 가운데 꽃 중심
  fill(255, 220, 100);
  circle(0, 0, 6);

  pop();
}

}

// ───────────────────────────
// 🌱 Seed Class
// ───────────────────────────
class Seed {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.age = 0;
    this.growTime = int(random(300, 600)); // 5~10초 후 꽃으로 성장
    this.alive = true;
  }

  update(flowers) {
    this.age++;
    if (this.age > this.growTime) {
      flowers.push(new Flower(this.pos.x, this.pos.y));
      this.alive = false;
    }
  }

  display() {
    push();
    noStroke();
    // 성장 단계에 따라 점점 커짐
    const size = map(this.age, 0, this.growTime, 3, 7);
    fill(180, 220, 120);
    circle(this.pos.x, this.pos.y, size);
    pop();
  }
}

// ───────────────────────────
// 🐝 Bee Class
// ───────────────────────────
class Bee {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.energy = 100;
    this.target = null;
  }

  // 가장 가까운 꽃 찾기
  seekFlower(flowers) {
    let closest = null;
    let closestDist = Infinity;
    for (let f of flowers) {
      let d = p5.Vector.dist(this.pos, f.pos);
      if (d < closestDist) {
        closestDist = d;
        closest = f;
      }
    }
    this.target = closest;
  }

  // 꽃 방문 시
  visit(flower, seeds) {
    flower.receivePollen(1);

    if (flower.nectar > 0) {
      flower.nectar = max(0, flower.nectar - 0.02);
      this.energy = min(100, this.energy + 0.5);
    }

    // 일정 확률로 씨앗 생성 (벌에 의한 확산)
    if (random() < 0.02) {
      const newX = constrain(flower.pos.x + random(-60, 60), 0, width);
      const newY = constrain(flower.pos.y + random(-60, 60), 0, height);
      seeds.push(new Seed(newX, newY));
    }
  }

  update(flowers) {
    if (!this.target || random() < 0.01) {
      this.seekFlower(flowers);
    }

    if (this.target) {
      let dir = p5.Vector.sub(this.target.pos, this.pos);
      dir.normalize().mult(0.05);

      // 바람 영향
      const windForce = wind.sample(this.pos.x, this.pos.y).mult(0.18);

      // 이동 벡터 업데이트
      this.vel.lerp(dir, 0.1);
      this.vel.add(windForce);
      this.vel.add(p5.Vector.random2D().mult(0.05));
      this.vel.mult(0.95);
      this.vel.limit(2.0);
      this.pos.add(this.vel);
      this.wrap();
    }
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
    rotate(angle);
    noStroke();

    // 몸통
    fill(255, 204, 0);
    ellipse(0, 0, 12, 8);

    // 검은 줄무늬
    fill(0);
    rect(-3, -4, 2, 8);
    rect(1, -4, 2, 8);

    // 날개
    fill(255, 255, 255, 160);
    ellipse(-3, -6, 6, 3);
    ellipse(3, -6, 6, 3);

    // 눈
    fill(0);
    ellipse(5, -1, 2, 2);
    pop();
  }
}
