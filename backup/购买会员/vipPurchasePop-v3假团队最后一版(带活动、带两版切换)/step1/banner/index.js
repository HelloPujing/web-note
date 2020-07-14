import React, { useState, useEffect } from 'react';
import { adapterImgRule } from 'Service/imageRuleStyle';
import networkService from 'Service/networkService';
import Api from '@src/api';
import './index.less';

const getImgStyle = img => {
  let style;

  switch (true) {
    case img === 'noData':
      style = { backgroundImage: 'unset' };
      break;
    case !!img:
      style = {
        backgroundImage: `url(${adapterImgRule(
          'vipPay', 'banner', img, 1
        )})`
      };
      break;
    default:
      style = null;
      break;
  }
  return style;
};

const Banner = React.memo(() => {
  const [img, setImg] = useState('noData');

  useEffect(() => {
    networkService
      .get({ url: `${Api.member.getPurPageBanner}?type=pc` })
      .then(r => {
        setImg(r);
      });
  }, []);

  const style = getImgStyle(img);

  return (
    <div
      styleName="banner"
      style={style}
    />
  );
});

export default Banner;
