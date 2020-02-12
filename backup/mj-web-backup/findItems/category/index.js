import React from 'react';
import { Link } from 'react-router-dom';
import { STYLE } from '../const';
import './index.less';

/* 查找单品 - 类目 */
const Category = React.memo(({ width, title }) => {
  // 图片边长
  const l = width - STYLE.GAP;

  return (
    <div
      style={{
        marginRight: `${STYLE.GAP}px`,
        width: `${l}px`
      }}
      styleName="category-wrapper"
    >
      <Link to="" title={title}>
        {/* 图片 */}
        <img
          style={{
            width: `${l}px`,
            height: `${l}px`
          }}
          src=""
          alt={title}
        />
        {/* 标题 */}
        <p>{title}</p>
      </Link>
    </div>
  );
});

export default Category;
