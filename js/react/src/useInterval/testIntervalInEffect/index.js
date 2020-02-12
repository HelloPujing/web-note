import React, {useState, useEffect} from 'react';

/**
 * @desc 定时器1秒更新一次count
 * 实际上，只执行了1次
 *
 */
const TestIntervalInEffect = () => {
  const [count, setCount] = useState(0);
  console.log(count);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1)
    }, 1000);
    return clearImmediate(id);
  }, []);

  return (
    <div styleName="">
      {count}
    </div>
  );
};

export default TestIntervalInEffect;
