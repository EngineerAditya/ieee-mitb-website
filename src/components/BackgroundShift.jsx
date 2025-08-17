import { useEffect, useRef } from "react";

class SimplexNoise {
  constructor(r = Math) {
    this.p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) this.p[i] = i;
    for (let i = 0; i < 256; i++) {
      let rIndex = r.random() * 256;
      let tmp = this.p[i];
      this.p[i] = this.p[rIndex | 0];
      this.p[rIndex | 0] = tmp;
    }
    this.perm = new Uint8Array(512);
    for (let i = 0; i < 512; i++) this.perm[i] = this.p[i & 255];
  }
  noise3D(x, y, z) {
    let X = Math.floor(x) & 255;
    let Y = Math.floor(y) & 255;
    let Z = Math.floor(z) & 255;
    return this.perm[X + this.perm[Y + this.perm[Z]]] / 255;
  }
}

export default function BackgroundShift({ opacity = 1, className = "", style = {} }) {
  const animationRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const circleCount = 120;
    const circlePropCount = 8;
    const circlePropsLength = circleCount * circlePropCount;
    const baseSpeed = 0.1;
    const rangeSpeed = 1;
    const baseTTL = 150;
    const rangeTTL = 200;
    const baseRadius = 80;
    const rangeRadius = 200;
    const rangeHue = 60;
    const xOff = 0.0015;
    const yOff = 0.0015;
    const zOff = 0.0015;
    const backgroundColor = "hsla(0,0%,5%,1)";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Container div absolutely positioned behind everything
    const container = document.getElementById("shift-bg-container");
    if (!container) return console.warn("BackgroundShift: Container not found");
    containerRef.current = container;

    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "0"; // behind content
    canvas.style.pointerEvents = "none"; // clicks go through
    container.appendChild(canvas);

    let simplex = new SimplexNoise();
    let baseHue = 220;
    const circleProps = new Float32Array(circlePropsLength);

    const rand = (n) => Math.random() * n;
    const fadeInOut = (t, m) => {
      let hm = 0.5 * m;
      return Math.abs(((t + hm) % m) - hm) / hm;
    };
    const TAU = 2 * Math.PI;

    function initCircle(i) {
      let x = rand(canvas.width);
      let y = rand(canvas.height);
      let n = simplex.noise3D(x * xOff, y * yOff, baseHue * zOff);
      let t = rand(TAU);
      let speed = baseSpeed + rand(rangeSpeed);
      let vx = speed * Math.cos(t);
      let vy = speed * Math.sin(t);
      let life = 0;
      let ttl = baseTTL + rand(rangeTTL);
      let radius = baseRadius + rand(rangeRadius);
      let hue = baseHue + n * rangeHue;
      circleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);
    }

    function initCircles() {
      for (let i = 0; i < circlePropsLength; i += circlePropCount) initCircle(i);
    }

    function updateCircle(i) {
      let x = circleProps[i];
      let y = circleProps[i + 1];
      let vx = circleProps[i + 2];
      let vy = circleProps[i + 3];
      let life = circleProps[i + 4];
      let ttl = circleProps[i + 5];
      let radius = circleProps[i + 6];
      let hue = circleProps[i + 7];

      ctx.save();
      ctx.fillStyle = `hsla(${hue},60%,30%,${fadeInOut(life, ttl)})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, TAU);
      ctx.fill();
      ctx.closePath();
      ctx.restore();

      life++;
      circleProps[i] = x + vx;
      circleProps[i + 1] = y + vy;
      circleProps[i + 4] = life;

      if (x < -radius || x > canvas.width + radius || y < -radius || y > canvas.height + radius || life > ttl) {
        initCircle(i);
      }
    }

    function updateCircles() {
      baseHue++;
      for (let i = 0; i < circlePropsLength; i += circlePropCount) updateCircle(i);
    }

    function draw() {
      if (!containerRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      updateCircles();
      requestAnimationFrame(draw);
    }

    function resize() {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    }

    resize();
    initCircles();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (canvas.parentNode === containerRef.current) containerRef.current.removeChild(canvas);
    };
  }, []);

  return (
    <div
      id="shift-bg-container"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 0, opacity: opacity, ...style }}
    />
  );
}
