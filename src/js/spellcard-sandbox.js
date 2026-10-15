// Canvas flight preview; owns its animation, input and teardown lifecycle.
function projectilePosition(kind, index, count, time, assessment) {
  const lane = index / Math.max(1, count - 1);
  const speed = 0.055 + assessment.draft.speed * 0.018;
  const phase = (time * speed + index * 0.037) % 1;
  if (kind === "orbit") {
    const angle = lane * Math.PI * 2 + time * (0.28 + assessment.draft.randomness * 0.035) * (index % 2 ? 1 : -1);
    const radius = 0.08 + phase * 0.62;
    return { x: 0.5 + Math.cos(angle) * radius, y: 0.28 + Math.sin(angle) * radius * 0.72 };
  }
  if (kind === "fan") {
    const angle = -1.15 + lane * 2.3 + Math.sin(time + index) * assessment.draft.randomness * 0.018;
    return { x: 0.5 + Math.sin(angle) * phase * 0.68, y: 0.08 + Math.cos(angle) * phase * 0.9 };
  }
  if (kind === "lattice") {
    const columns = 9;
    const column = index % columns;
    const row = Math.floor(index / columns);
    const offset = Math.sin(time * assessment.draft.changeFrequency * 0.5 + row) * 0.045 * assessment.draft.randomness;
    return { x: 0.08 + column / (columns - 1) * 0.84 + offset, y: (phase + row * 0.13) % 1.08 - 0.04 };
  }
  if (kind === "wave") {
    const side = index % 2;
    return {
      x: side ? phase : 1 - phase,
      y: 0.12 + lane * 0.78 + Math.sin(time * 1.4 + index * 0.7) * 0.055,
    };
  }
  const folded = phase < 0.5 ? phase * 2 : 2 - phase * 2;
  return {
    x: (index % 2 ? folded : 1 - folded),
    y: 0.08 + lane * 0.84 + Math.sin(time + index) * 0.02 * assessment.draft.randomness,
  };
}

export function startSandbox(root, canvas, assessmentGetter, c) {
  const context = canvas.getContext("2d", { alpha: false });
  const player = { x: 0.5, y: 0.82 };
  const keys = new Set();
  let hits = 0;
  let grazes = 0;
  let lastHit = 0;
  let lastGraze = 0;
  let started = performance.now();
  let lastFrame = 0;
  let manuallyPaused = false;
  let visible = true;
  let active = true;
  let frame = 0;
  let dragging = false;

  const resize = () => {
    const box = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(320, Math.round(box.width * ratio));
    const height = Math.max(300, Math.round(box.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  };

  const reset = () => {
    hits = 0;
    grazes = 0;
    player.x = 0.5;
    player.y = 0.82;
    started = performance.now();
    root.querySelector("[data-spell-hits]").textContent = "0";
    root.querySelector("[data-spell-grazes]").textContent = "0";
  };

  const moveFromPointer = (event) => {
    const box = canvas.getBoundingClientRect();
    player.x = Math.min(0.97, Math.max(0.03, (event.clientX - box.left) / box.width));
    player.y = Math.min(0.97, Math.max(0.05, (event.clientY - box.top) / box.height));
  };

  const draw = (now) => {
    if (!active) return;
    frame = window.requestAnimationFrame(draw);
    if (manuallyPaused || !visible || document.hidden || now - lastFrame < 33) return;
    const delta = Math.min(0.05, (now - lastFrame) / 1000 || 0);
    lastFrame = now;
    resize();
    const assessment = assessmentGetter();
    const elapsed = (now - started) / 1000;
    const cycle = Math.max(6, 11 - assessment.draft.changeFrequency);
    const cycleTime = elapsed % cycle;
    const declaration = cycleTime < assessment.draft.declarationDelay;
    const focus = keys.has("Shift");
    const moveSpeed = (focus ? 0.17 : 0.34) * delta;
    if (keys.has("ArrowLeft") || keys.has("a")) player.x -= moveSpeed;
    if (keys.has("ArrowRight") || keys.has("d")) player.x += moveSpeed;
    if (keys.has("ArrowUp") || keys.has("w")) player.y -= moveSpeed;
    if (keys.has("ArrowDown") || keys.has("s")) player.y += moveSpeed;
    player.x = Math.min(0.97, Math.max(0.03, player.x));
    player.y = Math.min(0.97, Math.max(0.05, player.y));

    const width = canvas.width;
    const height = canvas.height;
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#111d2b");
    gradient.addColorStop(1, "#271b25");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "rgba(226, 197, 132, .14)";
    context.lineWidth = 1;
    for (let ring = 1; ring < 5; ring += 1) {
      context.beginPath();
      context.arc(width / 2, height * 0.28, ring * Math.min(width, height) * 0.105, 0, Math.PI * 2);
      context.stroke();
    }

    const corridor = assessment.metrics.effectiveCorridor / 100;
    const corridorCentre = 0.5 + Math.sin(elapsed * assessment.draft.changeFrequency * 0.36) * assessment.draft.randomness * 0.018;
    context.fillStyle = "rgba(224, 204, 156, .08)";
    context.fillRect((corridorCentre - corridor / 2) * width, 0, corridor * width, height);
    context.strokeStyle = "rgba(224, 204, 156, .35)";
    context.setLineDash([7, 8]);
    context.strokeRect((corridorCentre - corridor / 2) * width, 0, corridor * width, height);
    context.setLineDash([]);

    const status = root.querySelector("[data-spell-flight-state]");
    if (status) status.textContent = declaration ? c.declaration : c.flight;
    const bulletPositions = [];
    if (declaration) {
      const progress = Math.min(1, Math.max(0, cycleTime / Math.max(0.4, assessment.draft.declarationDelay)));
      context.strokeStyle = `rgba(222, 72, 82, ${0.25 + progress * 0.65})`;
      context.lineWidth = 2 + assessment.draft.flashLevel;
      context.beginPath();
      context.arc(width / 2, height * 0.28, progress * Math.min(width, height) * 0.31, 0, Math.PI * 2);
      context.stroke();
    } else {
      const count = assessment.metrics.projectileBudget;
      for (let index = 0; index < count; index += 1) {
        const point = projectilePosition(assessment.pattern.kind, index, count, elapsed, assessment);
        const inCorridor = Math.abs(point.x - corridorCentre) < corridor / 2;
        if (inCorridor) point.x += (point.x < corridorCentre ? -1 : 1) * corridor * 0.62;
        if (point.x < -0.05 || point.x > 1.05 || point.y < -0.05 || point.y > 1.05) continue;
        bulletPositions.push(point);
        const radius = 2.7 + assessment.draft.density * 0.55;
        context.fillStyle = index % 3 === 0 ? "#e9c27b" : index % 3 === 1 ? "#c84b5b" : "#7fb6cf";
        context.beginPath();
        context.arc(point.x * width, point.y * height, radius, 0, Math.PI * 2);
        context.fill();
        if (assessment.draft.flashLevel > 1) {
          context.strokeStyle = "rgba(255,255,255,.22)";
          context.beginPath();
          context.arc(point.x * width, point.y * height, radius + 3 + assessment.draft.flashLevel, 0, Math.PI * 2);
          context.stroke();
        }
      }
    }

    const px = player.x * width;
    const py = player.y * height;
    let nearest = Infinity;
    bulletPositions.forEach((point) => {
      const distance = Math.hypot(point.x * width - px, point.y * height - py);
      nearest = Math.min(nearest, distance);
    });
    if (nearest < 9 && now - lastHit > 430) {
      hits += 1;
      lastHit = now;
      root.querySelector("[data-spell-hits]").textContent = String(hits);
    } else if (nearest < 24 && now - lastGraze > 190) {
      grazes += 1;
      lastGraze = now;
      root.querySelector("[data-spell-grazes]").textContent = String(grazes);
    }

    context.fillStyle = "#fff8df";
    context.beginPath();
    context.arc(px, py, focus ? 4 : 5.5, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#d84150";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(px, py, focus ? 7 : 10, 0, Math.PI * 2);
    context.stroke();
    if (focus) {
      context.fillStyle = "#d84150";
      context.beginPath();
      context.arc(px, py, 2.1, 0, Math.PI * 2);
      context.fill();
    }
  };

  const keyDown = (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "a", "s", "d", "Shift"].includes(event.key)) return;
    keys.add(event.key);
    if (event.key.startsWith("Arrow") || event.key === " ") event.preventDefault();
  };
  const keyUp = (event) => keys.delete(event.key);
  canvas.addEventListener("keydown", keyDown);
  canvas.addEventListener("keyup", keyUp);
  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    canvas.setPointerCapture(event.pointerId);
    moveFromPointer(event);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (dragging) moveFromPointer(event);
  });
  canvas.addEventListener("pointerup", () => { dragging = false; });
  root.querySelector("[data-spell-reset-flight]")?.addEventListener("click", reset);
  root.querySelector("[data-spell-pause]")?.addEventListener("click", (event) => {
    manuallyPaused = !manuallyPaused;
    event.currentTarget.textContent = manuallyPaused ? c.resume : c.pause;
  });
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }, { threshold: 0.05 });
  observer.observe(canvas);
  frame = window.requestAnimationFrame(draw);
  return () => {
    active = false;
    window.cancelAnimationFrame(frame);
    observer.disconnect();
    canvas.removeEventListener("keydown", keyDown);
    canvas.removeEventListener("keyup", keyUp);
  };
}
