import React from 'react';
import Popover from '@src/widgets/popover';
import { adapterImgRule } from 'Service/imageRuleStyle';
import styles from './index.less';

const ModalPrivilege = React.memo(({ privileges }) => {
  return (
    <div styleName="modal-content">
      <h2>美间会员{privileges.length}项特权</h2>
      <div styleName="privileges-wrapper">
        {
          privileges.map(privilege => {
            const { img, name, describe } = privilege || {};
            return (
              <Popover
                popperClass={styles.popover}
                trigger="hover"
                placement="bottom"
                animationTime={0}
                visibleArrow
                content={describe || name}
              >
                <div styleName="privilege-block">
                  <div
                    style={{ backgroundImage: `url(${adapterImgRule('vipPay', 'privilegeThumbnail', img)})` }}
                    styleName="img"
                  />
                  <h6>{name}</h6>
                </div>
              </Popover>
            );
          })
        }
      </div>
      <div styleName="more">
        更多特权敬请期待
      </div>
    </div>
  );
});

export default ModalPrivilege;
