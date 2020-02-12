import React, { useState } from 'react';
import useAdapter from './hooks/useAdapter';
import Category from './category';
import Flipper from './flipper';
import styles from './main.less';

const ref = React.createRef('');

const Main = React.memo(() => {
  // 数据
  const [list, setList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);

  // 可视容器宽度
  const [categoryW, n] = useAdapter(ref);

  // 可视类目首个索引
  const [index, setIndex] = useState(0);
  const pre = () => setIndex(index - 1);
  const next = () => setIndex(index + 1);

  // 索引修正，以下判断顺序保持（以防过度修正）
  if (index + n > list.length) {
    const _v = list.length - n;
    const v = _v >= 0 ? _v : 0;
    if (v !== index) {
      console.log(`修正右边界${index}->v`);
      setIndex(v);
    }
  }
  if (index < 0) {
    console.log(`修正左边界${index}->v`);
    setIndex(0);
  }

  // 翻页器状态
  const preDisabled = index <= 0;
  const nextDisabled = index + n >= list.length;

  // x轴偏移量
  const translateX = index * categoryW;

  console.log(index, n, list.length, setList);

  if (!list || !list.length) {
    return (
      <div>骨架图</div>
    );
  }

  return (
    <div styleName="find-item">
      {/* 左箭头 */}
      <Flipper
        className={styles.pre}
        iconfontId="back"
        disabled={preDisabled}
        onClick={pre}
      />
      {/* 可视区域 */}
      <div
        styleName="stage"
        ref={ref}
      >
        {/* 长列表 */}
        <div
          styleName="long-list"
          style={{
            transform: `translate3d(${-translateX}px, 0, 0)`
          }}
        >
          {
            categoryW > 0 && list.map((category, i) => {
              const { id } = category || {};
              return (
                <Category
                  key={id || i}
                  width={categoryW}
                  title={i}
                />
              );
            })
          }
        </div>
      </div>
      {/* 右箭头 */}
      <Flipper
        className={styles.next}
        iconfontId="next"
        disabled={nextDisabled}
        onClick={next}
      />
    </div>
  );
});

export default Main;
