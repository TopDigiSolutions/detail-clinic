import { expect, test } from '@playwright/test';
import { detailAnimation, DETAIL_CLEAN_START, DETAIL_CLEAN_END } from '../lib/detailAnimation';

test('cleaning starts when the car faces the camera and reverses with scroll', () => {
  expect(detailAnimation(DETAIL_CLEAN_START).rotation).toBeCloseTo(Math.PI / 4);
  expect(detailAnimation(DETAIL_CLEAN_START - 0.01).clean).toBe(0);
  expect(detailAnimation(DETAIL_CLEAN_START + 0.01).clean).toBeGreaterThan(0);
  expect(detailAnimation(DETAIL_CLEAN_START + 0.01).stage).toBe(1);
  expect(detailAnimation(DETAIL_CLEAN_END).clean).toBe(1);
  expect(detailAnimation(DETAIL_CLEAN_END).stage).toBe(2);
  expect(detailAnimation(0.4).clean).toBeLessThan(detailAnimation(0.6).clean);
  expect(detailAnimation(0).clean).toBe(0);
});
