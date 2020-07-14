import React, { useState, useEffect, useRef } from 'react';
import getCountdown from '@src/core/countdown';
import useInterval from '@src/utils/useInterval';
import styles from './index.less';


/*
* 备注：
* tab后台运行（非激活）延时问题：
* 1.非激活状态，setInterval，如果1s以上，是能正常运行的
* 2.但是setState会连续置成一样的值
* 所以不能直接用ms来减1，设个变量去保存（正因为setInterval执行正常，所以该值是无误的）
* 然后直接用该变量去设该值，无论当次set是否成功，都能保证值是对的
*
* */
const ActivityBg = React.memo(({ activity, setActivity }) => {
  const [ms, setMs] = useState(activity.remainTime || 0);

  const persist/* 防止后台延时 */ = useRef();

  // 倒计时
  useEffect(() => {
    setMs(activity.remainTime);
    persist.current = activity.remainTime;
  }, [activity.remainTime]);

  const tick = () => {
    if (ms >= 1000) {
      persist.current -= 1000;
      setMs(persist.current);
    } else {
      setActivity({ remainTime: 0 });
    }
  };

  useInterval(tick, 1000);

  const { days, toString } = getCountdown(ms);

  return (
    <div styleName="member-activity-bg">
      {/* 会员 大标题 */}
      <div styleName="countdown-title">
        {
          days > 0 && (<div styleName="day">{days}天</div>)
        }
        <div styleName="time">{toString(styles.time)}</div>
      </div>
    </div>
  );
});

export default ActivityBg;
