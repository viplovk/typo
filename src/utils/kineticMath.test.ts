import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp,
  lerp,
  calculateMagneticOffset,
  calculateParallax,
  calculateScrollVelocity,
  splitTextIntoCharacters,
  formatSwissTime,
} from './kineticMath';

test('clamp restricts values to boundaries', () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-5, 0, 10), 0);
  assert.equal(clamp(15, 0, 10), 10);
});

test('lerp calculates linear interpolation accurately', () => {
  assert.equal(lerp(0, 100, 0.5), 50);
  assert.equal(lerp(10, 20, 0.1), 11);
  assert.equal(lerp(100, 200, 0), 100);
  assert.equal(lerp(100, 200, 1), 200);
});

test('calculateMagneticOffset applies quadratic falloff inside radius', () => {
  const cursor = { x: 100, y: 100 };
  const target = { x: 100, y: 100 };
  // Exactly at target: distance is 0, offset is 0
  const zeroOffset = calculateMagneticOffset(cursor, target, 150, 30);
  assert.equal(zeroOffset.strength, 0);
  assert.equal(zeroOffset.x, 0);

  // Within radius
  const closeCursor = { x: 130, y: 100 };
  const result = calculateMagneticOffset(closeCursor, target, 150, 30);
  assert.equal(result.distance, 30);
  assert.ok(result.strength > 0 && result.strength <= 1);
  assert.ok(result.x > 0);
  assert.equal(result.y, 0);

  // Outside radius
  const farCursor = { x: 300, y: 100 };
  const farResult = calculateMagneticOffset(farCursor, target, 150, 30);
  assert.equal(farResult.strength, 0);
  assert.equal(farResult.x, 0);
  assert.equal(farResult.y, 0);
});

test('calculateParallax calculates correct 3D tilt angles', () => {
  // Center of screen should have zero tilt
  const centerTilt = calculateParallax(500, 400, 1000, 800, 15);
  assert.equal(centerTilt.rotateX, 0);
  assert.equal(centerTilt.rotateY, 0);

  // Top-left cursor
  const topLeftTilt = calculateParallax(0, 0, 1000, 800, 15);
  assert.equal(topLeftTilt.rotateX, 15); // Mouse at top tilts X up
  assert.equal(topLeftTilt.rotateY, -15); // Mouse at left tilts Y left

  // Bottom-right cursor
  const bottomRightTilt = calculateParallax(1000, 800, 1000, 800, 15);
  assert.equal(bottomRightTilt.rotateX, -15);
  assert.equal(bottomRightTilt.rotateY, 15);
});

test('calculateScrollVelocity handles delta time and distance', () => {
  assert.equal(calculateScrollVelocity(100, 0, 1000), 100); // 100px in 1s = 100px/s
  assert.equal(calculateScrollVelocity(200, 100, 500), 200); // 100px in 0.5s = 200px/s
  assert.equal(calculateScrollVelocity(100, 100, 500), 0); // No movement
  assert.equal(calculateScrollVelocity(100, 0, 0), 0); // Zero delta time safety
});

test('splitTextIntoCharacters splits text into tokens with index tracking', () => {
  const chars = splitTextIntoCharacters('MOVE BEYOND');
  assert.equal(chars.length, 11);
  assert.equal(chars[0].char, 'M');
  assert.equal(chars[0].isSpace, false);
  assert.equal(chars[0].wordIndex, 0);

  assert.equal(chars[4].char, ' ');
  assert.equal(chars[4].isSpace, true);

  assert.equal(chars[5].char, 'B');
  assert.equal(chars[5].wordIndex, 1);
});

test('formatSwissTime formats UTC hours, minutes and seconds', () => {
  const fixedDate = new Date('2026-11-08T12:34:56Z');
  const formatted = formatSwissTime(fixedDate);
  assert.equal(formatted, '12:34:56 UTC');
});
