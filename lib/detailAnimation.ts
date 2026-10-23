// The detail camera sits at 45 degrees to the car's forward (+Z) axis.
export const DETAIL_INITIAL_ROTATION = -0.45;
export const DETAIL_CLEAN_START = (Math.PI / 4 - DETAIL_INITIAL_ROTATION) / (2 * Math.PI);
export const DETAIL_CLEAN_END = 0.95;

export function detailAnimation(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  const clean = Math.max(0, Math.min(1,
    (p - DETAIL_CLEAN_START) / (DETAIL_CLEAN_END - DETAIL_CLEAN_START),
  ));
  return {
    rotation: DETAIL_INITIAL_ROTATION + p * Math.PI * 2,
    clean,
    stage: p < DETAIL_CLEAN_START ? 0 : p < DETAIL_CLEAN_END ? 1 : 2,
  };
}
