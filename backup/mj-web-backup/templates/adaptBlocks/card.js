import React from 'react';
import './card.less';

const Card = React.memo(() => {
  return (
    <div styleName="card-wrapper">
      <figure style={{ backgroundImage: '' }}>
        <img src="" alt="" />
        <figcaption>
          <p>主标题</p>
          <p>子标题</p>
        </figcaption>
      </figure>
    </div>
  );
});

export default Card;
