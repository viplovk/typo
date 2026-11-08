/**
 * Pure math and utility calculations for kinetic typography physics,
 * parallax depth, magnetic attraction, and text manipulation.
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface MagneticResult {
  x: number;
  y: number;
  distance: number;
  strength: number;
}

/**
 * Clamps a number between min and max bounds.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values.
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Calculates magnetic displacement vector from a point to a target.
 * Pulls or repels based on proximity within radius.
 */
export function calculateMagneticOffset(
  cursor: Point2D,
  target: Point2D,
  radius: number = 150,
  maxOffset: number = 30
): MagneticResult {
  const dx = cursor.x - target.x;
  const dy = cursor.y - target.y;
  const distance = Math.hypot(dx, dy);

  if (distance === 0 || distance >= radius) {
    return { x: 0, y: 0, distance, strength: 0 };
  }

  // Smooth cubic ease falloff
  const normalizedDist = distance / radius;
  const strength = Math.pow(1 - normalizedDist, 2);

  // Offset proportional to distance and strength, capped by maxOffset
  const angle = Math.atan2(dy, dx);
  const offsetMagnitude = clamp(strength * maxOffset, 0, maxOffset);

  return {
    x: Math.cos(angle) * offsetMagnitude,
    y: Math.sin(angle) * offsetMagnitude,
    distance,
    strength,
  };
}

/**
 * Calculates 3D perspective rotation tilt based on mouse coordinates relative to center.
 */
export function calculateParallax(
  mouseX: number,
  mouseY: number,
  windowWidth: number,
  windowHeight: number,
  maxTiltDegrees: number = 15
): { rotateX: number; rotateY: number } {
  if (windowWidth <= 0 || windowHeight <= 0) {
    return { rotateX: 0, rotateY: 0 };
  }

  const normalizedX = (mouseX / windowWidth) * 2 - 1; // -1 to 1
  const normalizedY = (mouseY / windowHeight) * 2 - 1; // -1 to 1

  const clampedX = clamp(normalizedX, -1, 1);
  const clampedY = clamp(normalizedY, -1, 1);

  const rotX = -clampedY * maxTiltDegrees;
  const rotY = clampedX * maxTiltDegrees;

  return {
    rotateX: rotX === 0 ? 0 : rotX,
    rotateY: rotY === 0 ? 0 : rotY,
  };
}

/**
 * Calculates scroll velocity based on position delta and time delta.
 */
export function calculateScrollVelocity(
  currentPos: number,
  prevPos: number,
  deltaTimeMs: number
): number {
  if (deltaTimeMs <= 0) return 0;
  const deltaDistance = currentPos - prevPos;
  // returns px per second
  return (deltaDistance / deltaTimeMs) * 1000;
}

export interface SplitChar {
  char: string;
  isSpace: boolean;
  charIndex: number;
  wordIndex: number;
}

/**
 * Splits text into rich character tokens for character-by-character kinetic animations.
 */
export function splitTextIntoCharacters(text: string): SplitChar[] {
  const chars: SplitChar[] = [];
  const words = text.split(/(\s+)/);
  let globalCharIndex = 0;
  let wordIndex = 0;

  for (const token of words) {
    const isSpace = /^\s+$/.test(token);
    for (const char of token) {
      chars.push({
        char,
        isSpace,
        charIndex: globalCharIndex++,
        wordIndex,
      });
    }
    if (!isSpace) {
      wordIndex++;
    }
  }

  return chars;
}

/**
 * Formats a date into Swiss brutalist time format (e.g. "14:32:08 UTC · ZURICH")
 */
export function formatSwissTime(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const h = pad(date.getUTCHours());
  const m = pad(date.getUTCMinutes());
  const s = pad(date.getUTCSeconds());
  return `${h}:${m}:${s} UTC`;
}
