import React, {useState, useEffect, useRef} from 'react';

function useInterval(func, delay) {
  const persist = useRef();

  useEffect(() => {
    persist.current = func;
  });

  useEffect(() => {
    if ( delay === null) return;

    let id = setInterval(() =>  persist.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * @desc 定时器1秒更新一次count
 * 方案：
 * persist！across the re-renders
 * We setInterval(fn, delay) where fn calls savedCallback
 * Set savedCallback to callback1 after the first render.
 * Set savedCallback to callback1 after the first render.
 * Set savedCallback to callback2 after the next render.
 * ...
 *
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 */
const GoodInterval = () => {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const add = () => setCount(count + 1);

  useInterval(add, isRunning ? 1000 : null);

  return (
    <div>
      {count}
      <button onClick={() => setIsRunning(!isRunning)}>开关</button>
    </div>
  );
};

export default GoodInterval;
