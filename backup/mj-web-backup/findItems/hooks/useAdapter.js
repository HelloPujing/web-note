import { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { STYLE } from '../const';

// n in [min, max]
const isNumInLimit = (n, min, max) => n >= min && n <= max;

// n等分适配
const getAdaptDivider = () => {
  const { innerWidth: windowWidth = 1024 } = window || {};
  const isInLimit = (min, max) => isNumInLimit(windowWidth, min, max);
  switch (true) {
    case isInLimit(0, 1024):
    case isInLimit(1024, 1279):
      return 8;
    case isInLimit(1280, 1679):
      return 10;
    case isInLimit(1680, 1919):
      return 13;
    case isInLimit(1920, Number.MAX_SAFE_INTEGER):
      return 14;
    default:
      return 8;
  }
};

const WINDOW_RESIZE_TIME = 500;

// 计算动态适配，返回[每个类目宽度, 显示个数]
function useAdapter(ref) {
  const [stageW, setStageW] = useState(0);

  useEffect(() => {
    const onWindowChange = debounce(() => {
      if (!ref.current) return;

      setStageW(ref.current.clientWidth);
    }, WINDOW_RESIZE_TIME);

    onWindowChange();
    window.addEventListener('resize', onWindowChange);
    return () => {
      window.removeEventListener('resize', onWindowChange);
    };
  }, [ref]);

  const divider = getAdaptDivider();
  const categoryW = Math.floor( // 抹掉小数，有细微差距
    (stageW + STYLE.GAP) / divider // 抹掉最后一个间隙位置
  );
  if (stageW) console.log(`首页-查找单品-stage/窗口宽度：${stageW}/${window.innerWidth} -> ${categoryW} * ${divider}`);

  return [categoryW, divider]; // w, n
}

export default useAdapter;
