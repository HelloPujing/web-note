import React, { useCallback } from 'react';
import classnames from 'classnames';
import './button.less';

type ButtonProps = {
  /**
   * ['pink', 'blue', 'green', 'default']分别为红色、蓝色、绿色、白灰色，默认白灰色按钮
   */
  theme?: 'pink' | 'blue' | 'green' | 'default';
  /**
   * ['H54', 'H44', 'H40', 'H32', 'H28'] 按按钮高度划分尺寸
   */
  size?: 'H54' | 'H44' | 'H40' | 'H32' | 'H28';
  /**
   * 按钮形状：square: 方形, circle: 圆形, round: 椭圆
   */
  shape?: 'square' | 'circle' | 'round';
  /**
   * 字体是否加粗
   */
  bolder?: boolean;
  /**
   * 是否为空心按钮
   */
  ghost?: boolean;
  /**
   * 是否为block元素，即铺满容器
   */
  block?: boolean;
  /**
   * 自定义外部样式
   */
  style?: Object;
  className?: string;
  disabled?: boolean;
  onClick?: Function;
  children?: React.ReactNode;
};

const noop = () => {};

const Temp: React.FC<ButtonProps> = React.forwardRef(
  (
    {
      theme = 'default',
      size = 'H40',
      shape = 'square',
      bolder = false,
      ghost = false,
      block = false,
      className = '',
      children,
      onClick = noop,
      ...otherProps
    },
    ref?:
      | string
      | ((instance: HTMLButtonElement | null) => void)
      | React.RefObject<HTMLButtonElement>
      | null
      | undefined
  ) => {
    const handleOnClick = useCallback(() => {
      if (onClick) {
        onClick();
      }
    }, [onClick]);

    return (
      <button
        type="button"
        ref={ref}
        className={classnames(
          'mj-btn',
          {
            [`btn-${theme}`]: theme !== 'default',
            [`btn-${size}`]: size,
            [`btn-${shape}`]: shape,
            'btn-bold': bolder,
            'btn-ghost': ghost,
            'btn-block': block,
          },
          className
        )}
        onClick={handleOnClick}
        {...otherProps}
      >
        {children}
      </button>
    );
  }
);

export default Temp;
