import React, {useState, useEffect} from 'react';

/**
 * @desc 定时器1秒更新一次count
 * 实际上，只执行了1次
 *
 */
const BadInterval = () => {
  const [count, setCount] = useState(0);
  console.log(count);

  const updateCount = () => setCount(count + 1);

  useEffect(() => {
    const id = setInterval(updateCount, 1000);
    return clearImmediate(id);
  }, []);

  return (
    <div>
      {count}
    </div>
  );
};

export default BadInterval;
