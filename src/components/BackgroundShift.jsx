import { useEffect, useRef } from "react";

/**
 * SimplexNoise - Generates smooth, continuous noise for natural particle motion
 * 
 * This is a simplified 3D noise algorithm that creates smooth random values.
 * Used to make particles move in a more organic, flowing way rather than pure randomness.
 * 
 * How it works:
 * - Creates a permutation table (random shuffled array of 0-255)
 * - Uses 3D coordinates to generate noise values between 0-1
 * - Same input coordinates always produce same output (deterministic)
 * - Nearby coordinates produce similar values (smooth/continuous)
 */
class SimplexNoise {
  constructor(r = Math) {
    // Initialize permutation array with values 0-255
    this.p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) this.p[i] = i;
    
    // Shuffle the array randomly (Fisher-Yates shuffle)
    for (let i = 0; i < 256; i++) {
      let rIndex = r.random() * 256;
      let tmp = this.p[i];
      this.p[i] = this.p[rIndex | 0];
      this.p[rIndex | 0] = tmp;
    }
    
    // Create extended permutation table for wraparound (prevents edge artifacts)
    this.perm = new Uint8Array(512);
    for (let i = 0; i < 512; i++) this.perm[i] = this.p[i & 255];
  }
  
  /**
   * Generate 3D noise value for given coordinates
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate  
   * @param {number} z - Z coordinate (often used for animation/time)
   * @returns {number} Noise value in the range [0, 1] (inclusive on both ends)
   */
  noise3D(x, y, z) {
    let X = Math.floor(x) & 255;
    let Y = Math.floor(y) & 255;
    let Z = Math.floor(z) & 255;
    // Hash the coordinates through the permutation table
    return this.perm[X + this.perm[Y + this.perm[Z]]] / 255;
  }
}

/**
 * BackgroundShift - Animated particle background using Canvas API
 * 
 * Creates a mesmerizing animated background with 120 floating circles that:
 * - Move in smooth, organic patterns using SimplexNoise
 * - Fade in and out based on their lifetime
 * - Have varying colors (blues, oranges, greens)
 * - Different sizes and speeds for visual depth
 * - Automatically respawn when they exit the screen or expire
 * 
 * Performance:
 * - Renders at 60fps using requestAnimationFrame
 * - Uses Float32Array for efficient memory usage
 * - Canvas positioned behind all content (z-index: 0)
 * 
 * @param {number} opacity - Overall opacity of the background (0-1)
 * @param {string} className - Additional CSS classes
 * @param {object} style - Additional inline styles
 */
export default function BackgroundShift({ opacity = 1, className = "", style = {} }) {
  const _animationRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // ============= CONFIGURATION =============
    // Number of animated circles
    const circleCount = 120;
    // Properties per circle: [x, y, velocityX, velocityY, life, ttl, radius, hue]
    const circlePropCount = 8;
    const circlePropsLength = circleCount * circlePropCount;
    
    // Speed configuration
    const baseSpeed = 0.1;    // Minimum speed
    const rangeSpeed = 1;     // Additional random speed (0-1)
    
    // Lifetime configuration (frames before respawn)
    const baseTTL = 150;      // Minimum lifetime
    const rangeTTL = 200;     // Additional random lifetime
    
    // Size configuration
    const baseRadius = 80;    // Minimum radius
    const rangeRadius = 200;  // Additional random radius
    
    // Color configuration
    const rangeHue = 60;      // Hue variation range (creates color diversity)
    
    // Noise offsets for smooth motion
    const xOff = 0.0015;      // X-axis noise scaling
    const yOff = 0.0015;      // Y-axis noise scaling
    const zOff = 0.0015;      // Z-axis noise scaling (hue variation)
    
    const backgroundColor = "hsla(0,0%,5%,1)";  // Very dark gray

    // ============= CANVAS SETUP =============
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Get container element (must be created by the component's JSX)
    const container = document.getElementById("shift-bg-container");
    if (!container) return console.warn("BackgroundShift: Container not found");
    containerRef.current = container;

    // Position canvas absolutely behind all content
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "0"; // behind content
    canvas.style.pointerEvents = "none"; // clicks go through to content below
    container.appendChild(canvas);

    // ============= INITIALIZATION =============
    let simplex = new SimplexNoise();
    let baseHue = 220;  // Starting hue (blue-ish), increments each frame
    
    // Store all circle properties in a single typed array for performance
    // Format: [x, y, vx, vy, life, ttl, radius, hue, x, y, vx, vy, ...]
    const circleProps = new Float32Array(circlePropsLength);

    // ============= UTILITY FUNCTIONS =============
    const rand = (n) => Math.random() * n;
    
    /**
     * Calculate fade in/out opacity based on particle lifetime
     * Creates smooth fade at start and end of life
     * @param {number} t - Current life
     * @param {number} m - Max life (TTL)
     */
    const fadeInOut = (t, m) => {
      let hm = 0.5 * m;
      return Math.abs(((t + hm) % m) - hm) / hm;
    };
    
    const TAU = 2 * Math.PI;  // Full circle in radians

    /**
     * Initialize a single circle with random properties
     * @param {number} i - Index in the circleProps array
     */
    function initCircle(i) {
      // Random starting position
      let x = rand(canvas.width);
      let y = rand(canvas.height);
      
      // Use noise to influence initial hue (creates color variation based on position)
      let n = simplex.noise3D(x * xOff, y * yOff, baseHue * zOff);
      
      // Random direction (angle)
      let t = rand(TAU);
      
      // Calculate velocity from speed and direction
      let speed = baseSpeed + rand(rangeSpeed);
      let vx = speed * Math.cos(t);
      let vy = speed * Math.sin(t);
      
      // Lifetime tracking
      let life = 0;
      let ttl = baseTTL + rand(rangeTTL);
      
      // Visual properties
      let radius = baseRadius + rand(rangeRadius);
      let hue = baseHue + n * rangeHue;
      
      // Store all properties at index i
      circleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);
    }

    /**
     * Initialize all circles at startup
     */
    function initCircles() {
      for (let i = 0; i < circlePropsLength; i += circlePropCount) initCircle(i);
    }

    /**
     * Update and render a single circle
     * @param {number} i - Index in the circleProps array
     */
    function updateCircle(i) {
      // Read properties from array
      let x = circleProps[i];
      let y = circleProps[i + 1];
      let vx = circleProps[i + 2];
      let vy = circleProps[i + 3];
      let life = circleProps[i + 4];
      let ttl = circleProps[i + 5];
      let radius = circleProps[i + 6];
      let hue = circleProps[i + 7];

      // Draw the circle with fade effect
      ctx.save();
      ctx.fillStyle = `hsla(${hue},60%,30%,${fadeInOut(life, ttl)})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, TAU);
      ctx.fill();
      ctx.closePath();
      ctx.restore();

      // Update position and life
      life++;
      circleProps[i] = x + vx;
      circleProps[i + 1] = y + vy;
      circleProps[i + 4] = life;

      // Respawn if circle exits screen or lifetime expires
      if (x < -radius || x > canvas.width + radius || y < -radius || y > canvas.height + radius || life > ttl) {
        initCircle(i);
      }
    }

    /**
     * Update all circles each frame
     */
    function updateCircles() {
      baseHue++;  // Slowly shift all colors over time
      for (let i = 0; i < circlePropsLength; i += circlePropCount) updateCircle(i);
    }

    /**
     * Main animation loop - runs at 60fps
     */
    function draw() {
      if (!containerRef.current) return;
      
      // Clear canvas and fill with background color
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw all circles
      updateCircles();
      
      // Request next frame
      requestAnimationFrame(draw);
    }

    /**
     * Handle window resize - update canvas dimensions
     */
    function resize() {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    }

    // ============= START ANIMATION =============
    resize();       // Set initial canvas size
    initCircles();  // Create all circles
    draw();         // Start animation loop
    
    // Listen for window resize events
    window.addEventListener("resize", resize);

    // ============= CLEANUP =============
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
