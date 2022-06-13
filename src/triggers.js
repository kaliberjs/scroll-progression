export const triggers = { top, center, bottom, custom }

function top(offset = 0) {
  return { fraction: 0, offset }
}

function center(offset = 0) {
  return { fraction: 0.5, offset }
}

function bottom(offset = 0) {
  return { fraction: 1, offset }
}

function custom(fraction, offset = 0) {
  return { fraction, offset }
}
