import React, { useCallback, useEffect, useState } from 'react';
import Message from '@meijian/message';
import Modal from '@src/widgets/modal';
import Iconfont from '@src/components/iconfont';
import { isNumInLimit } from '@src/pages/vipPurchasePop/util';
import VipPopContext from '@src/pages/vipPurchasePop/context/vipPopContext';
import styles from './index.less';

// 内部数量及时修改
// 需要防抖的话外部处理

const NumberInput = React.memo(({
  defaultCount, min, max, onChange
}) => {
  const { setSolutionIndex } = React.useContext(VipPopContext);

  const [tempCount, setTempCount]/* 文本数量 */ = useState(defaultCount);
  const disabledSubtract = tempCount <= min;
  const disabledAdd = tempCount >= max;

  useEffect(() => { // 统一处理上报
    // 空串，只改本地
    // 小于最小值，可能依然在输入，只改本地
    if (tempCount === '' || tempCount < min) return;

    onChange(tempCount);
  }, [min, onChange, tempCount]);

  const onSubtract = useCallback(() => {
    setTempCount(Number(tempCount) - 1);
  }, [tempCount]);

  const onDisabledSubtract = useCallback(() => {
    const closeDialog = Modal.info({
      title: '您当前选择的团队版购买方案，2个起售',
      closeable: true,
      okProps: { text: '切换到个人版' },
      onOk: () => {
        setSolutionIndex(0); // XXX Pupuu: 固定索引，注意以后配置方案列表的情况
        closeDialog();
      }
    });
  }, [setSolutionIndex]);

  const onAdd = useCallback(() => {
    setTempCount(Number(tempCount) + 1);
  }, [tempCount]);

  const onChangeInput = useCallback(e => { // 变更Input值
    const { value } = e.target;
    if (/^[1-9][0-9]{0,2}$/.test(value) || value === '') {
      let fmtCount = value;
      if (value > max) {
        Message.error(`单次购买允许${min}～${max}份。可多次购买`);
        fmtCount = max;
      }
      setTempCount(fmtCount);
    } // 数字、空
  }, [max, min]);

  const onBlur = useCallback(() => { // 小于最小值的值，重置
    const [inLimit, fmtNum] = isNumInLimit(Number(tempCount), min, max);
    if (!inLimit) {
      Message.error(`单次购买允许${min}～${max}份。可多次购买`);
      if (fmtNum !== tempCount) {
        setTempCount(fmtNum);
      }
    }
  }, [max, min, tempCount]);

  const onKeyPress = useCallback(e => {
    if (e.key === 'Enter') {
      e.target.blur();
      onBlur();
    }
  }, [onBlur]);

  const getClassName = disabled => (disabled ? styles['group-count-btn-disabled'] : styles['group-count-btn']);

  return (
    <div styleName="group-count">
      <Iconfont
        id="minus-1"
        size={10}
        className={getClassName(disabledSubtract)}
        onClick={disabledSubtract ? onDisabledSubtract : onSubtract}
      />
      <input
        type="text"
        value={tempCount}
        onKeyPress={onKeyPress}
        onChange={onChangeInput}
        onBlur={onBlur}
      />
      <Iconfont
        id="add-1"
        size={10}
        className={getClassName(disabledAdd)}
        onClick={disabledAdd ? null : onAdd}
      />
    </div>
  );
});

export default NumberInput;
