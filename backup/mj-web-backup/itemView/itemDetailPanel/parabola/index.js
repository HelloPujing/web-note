/**
 * @desc
 * @param {object} config.originEl
 * @param {object} config.targetEl
 * @param {number} config.totalTime - 动画时间
 * @param {number} config.a
 * @param {number} config.offset
 * @param {function} config.updateCallback
 *
 *
 *
 * @example
 *
 */


export const parabola = config => {
  const {
    originEl,
    targetEl = document.getElementById('main-navbar-shoppingCart'),
    totalTime,
    a = 0.003,
    updateCallback,
    finishCallback
  } = config || {};
  const origionDimension = originEl.getBoundingClientRect();
  const targetDimension = targetEl.getBoundingClientRect();
  const x1 = origionDimension.left + 0.5 * origionDimension.width;
  const y1 = origionDimension.top + 0.5 * origionDimension.height;
  const x2 = targetDimension.left + 0.5 * targetDimension.width - 20;
  const y2 = targetDimension.top + 0.5 * targetDimension.height;
  const diffX = x2 - x1; // 可正可负
  const diffY = y2 - y1; // 可正可负
  const vx = diffX / totalTime;
  const v0 = (Math.abs(diffY) - a * totalTime * totalTime) / totalTime; // s = v0 * t + a * t * t


  const startTime = Date.now();


  const tick = setInterval(() => {
    const t = Date.now() - startTime;
    if (t > totalTime) {
      if (finishCallback) finishCallback();
      clearInterval(tick);
      return;
    }

    const movedX = parseInt(vx * t, 10);
    const movedY = parseInt(v0 * t + a * t * t, 10) * (-1);
    const x = parseInt(x1 + movedX, 10);
    const y = parseInt(y1 + movedY, 10);
    const fraction = parseFloat(t / totalTime);

    if (updateCallback) {
      updateCallback({
        tick,
        movedX,
        movedY,
        x,
        y,
        fraction
      });
    }
    // console.log(movedX, movedY);
    // console.log(x1, y1, movedX, movedY, x, y)
  }, 15);
};
