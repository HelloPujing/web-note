import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { adapterImgRule } from 'Service/imageRuleStyle';
import { getItemDetailStyle } from 'Service/itemService';
import debounce from 'lodash/debounce';
import { defineModuleName } from '@src/core/point';
import FindSimilarBtn from '@src/components/button/findSimilarBtn';
import DownloadBtn from './downloadBtn';

import styles from './index.less';


console.warn('样式列表', styles);
/**
 * @desc 单品详情主图部分
 *
 * ------------------------------------------------
 * 备注: 迁移先人老代码到src
 * 已完成：修复eslint、删除废弃的多余逻辑
 * 未完成：不合理命名、功能注释、老旧语法、冗杂的逻辑等
 *
 * 新增：
 * 下载功能 - 邮箱校验（废弃）
 * 下载功能 - 自动订阅品牌、抽离下载按钮
 *
 */

const propTypes = {
  info: PropTypes.instanceOf(Object),
  noSlideAnim: PropTypes.bool
};

const defaultProps = {
  info: {},
  noSlideAnim: true
};

@defineModuleName('ItemFrame')
class ItemFrame extends PureComponent {
  static contextTypes = {
    _analyze: PropTypes.func
  }

  static defaultProps = {
    noSlideAnim: true
  }

  state = {
    activeIndex/* 多图列表选中索引 */: 0,
    arrowIndex/* 多图翻页后第一个的索引 */: 0,
    stateIndex/* ？？？ */: 0,
    imgSize: null,
    imgLoading: true,
    disableAnimation: false,
    showSum/* 真实展示图数量 */: 4,
    isFlip: true
  }

  constructor() {
    super();
    this.resetImgSize = debounce(this.getRightSize, 300);
  }

  componentDidMount() {
    this.mounted = true;
    this.timer = null;
    this.thmargin = 12; // 单图margin bottom
    window.addEventListener('resize', this.resetImgSize);
    window.addEventListener('keydown', this.handleKeyDown);
    this.getRightSize();
    this.resetImgSize();
  }

  componentWillReceiveProps(nextProps) {
    const { info: prevInfo } = this.props;
    const { info: nextInfo } = nextProps;
    if (prevInfo.id !== nextInfo.id) {
      this.setState({
        activeIndex: 0,
        stateIndex: 0,
        arrowIndex: 0
      }, () => {
        const img = nextInfo.imgs && nextInfo.imgs[0];
        this.preloadImage(adapterImgRule('shop', 'smallLogo', img), () => {
          if (!this.updater.isMounted(this)) return;
          this.setState({ imgLoading: true });
          this.preloadImage(adapterImgRule('editor', 'listBoard', img), () => {
            if (!this.updater.isMounted(this)) return;
            this.setState({ imgLoading: false });
          });
        });
        this.startSlideAnim();
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resetImgSize);
    window.removeEventListener('keydown', this.handleKeyDown);
    this.clearSlideTimer();
  }

  preloadImage = (url, cb) => {
    const img = new Image();
    img.src = url;
    img.onload = () => cb(img.width / img.height);
  }

  getRightSize = () => {
    const { ItemFrameEl } = this;
    const { showSum } = this.state;
    const { clientHeight } = ItemFrameEl;
    const bodyw = document.body.clientWidth;

    let comRule; let top;
    const item = getItemDetailStyle(bodyw);
    const size = (ItemFrameEl.clientWidth - 40 - (item.w + 12) - 20 - 48) * 0.99; // 内间距  距左 距右 margin- 24
    if (size > clientHeight) { // 适配宽高
      comRule = clientHeight;
    } else {
      comRule = size;
    }
    const isFlip = false;
    const wh = (item.w + 8) * showSum + (showSum - 1) * this.thmargin;
    top = (clientHeight - comRule) / 2;
    if (top < 10) {
      top = 'initial';
    }
    this.setState({
      isFlip,
      imgSize: {
        tw: item.w,
        height: comRule, // 大小
        width: comRule, // 大小
        rightMar: (ItemFrameEl.clientWidth - 20 - (item.w + 12) - comRule) / 2, // 距离
        wrapHeight: wh,
        top
      }
    });
  }

  resetImgs = () => {
    const { info } = this.props;
    let { activeIndex } = this.state;
    const imgs = info.imgs || [];
    if (activeIndex === this.sliceImgs(imgs).length) this.goTo(++activeIndex);
  }

  goTo = i => {
    const { info } = this.props;
    const l = this.sliceImgs(info.imgs).length;
    const disableAnimation = i === l + 1;
    if (l <= 1) return;
    this.setState({
      activeIndex: disableAnimation ? 0 : i,
      disableAnimation
    });
  }

  startSlideAnim = () => {
    const { info, noSlideAnim } = this.props;

    if (noSlideAnim) return;
    const ms = 3000;
    this.clearSlideTimer();
    if (info.imgs && info.imgs.length <= 1) return;
    const slide = () => {
      let { activeIndex } = this.state;
      this.goTo(++activeIndex);
      this.timer = setTimeout(slide, ms);
    };
    this.timer = setTimeout(slide, ms);
  }

  clearSlideTimer = () => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  sliceImgs = imgs => {
    if (!Array.isArray(imgs)) return [];
    return imgs.slice(0, 8);
  }

  arrow = i => {
    const { info } = this.props;
    const { stateIndex } = this.state;
    const l = this.sliceImgs(info.imgs).length;
    const s = stateIndex + i;
    const n = s * 2;
    const arrowAnimation = n > l || n < 0;
    if (l <= 1) return;
    this.setState({
      arrowIndex: arrowAnimation ? 0 : Math.abs(n),
      stateIndex: s
    });
  }

  render() {
    const { _analyze } = this.context;
    const { info, moduleName } = this.props;
    const {
      activeIndex, arrowIndex, imgSize, imgLoading, disableAnimation, stateIndex, isFlip
    } = this.state;
    const imgs = info.imgs || []; // null !== undefined
    const needSlide = imgs.length > 1;
    const slicedImgs = this.sliceImgs(imgs);
    const _imgs = needSlide ? slicedImgs.concat(imgs[0]) : imgs;
    const filterStyle = imgLoading ? { filter: 'blur(5px)' } : null;
    // 当前图片id
    const currentImgId = activeIndex > -1 ? imgs[activeIndex] : '';
    const ItemSize = needSlide ? {
      ...imgSize,
      float: 'right',
      right: imgSize && imgSize.rightMar,
      top: imgSize && imgSize.top
    } : {
      ...imgSize,
      top: needSlide ? imgSize && imgSize.top : 'inherit'
    };
    const thus = needSlide ? {
      width: imgSize.tw,
      height: imgSize.tw
    } : {};
    const thusActive = needSlide ? {
      width: imgSize && imgSize.tw + 8, // 加入padding
      height: imgSize && imgSize.tw + 8
    } : {};
    const thusCont = needSlide ? {
      height: imgSize && imgSize.wrapHeight, // 加入padding
      width: imgSize && imgSize.tw + 6
    } : {};
    return (
      <div styleName="wrapper">
        {/* 废弃左右箭头 */}
        <div
          styleName={`container${needSlide ? '' : ' center'} ${info.readyDeleted ? 'center-col' : ''}`}
          ref={el => { this.ItemFrameEl = el; }}
        >
          {/* 多图 */}
          {
            slicedImgs.length > 0 ? (
              <div styleName={`${needSlide ? ' thumbNail' : ''}`}>
                <div styleName="content-insert" style={{ ...thusCont }}>
                  <div
                    styleName="wrap"
                    style={{ transform: `translateY(-${arrowIndex === 0 ? 0 : (arrowIndex * (imgSize.tw + 8) + (arrowIndex - 1) * this.thmargin + 12)}px)` }}
                  >
                    {
                      needSlide && !imgLoading && slicedImgs.map((img, i) => {
                        return (
                          <i
                            key={i}
                            styleName={`dot${activeIndex === i ? ' active-in' : ''}`}
                            style={activeIndex === i ? {
                              ...thusActive,
                              backgroundImage: `url(${adapterImgRule('item', 'editor', img)})`
                            } : {
                              ...thus,
                              backgroundImage: `url(${adapterImgRule('item', 'editor', img)})`
                            }}
                            onClick={() => {
                              this.goTo(i);
                              this.startSlideAnim();
                            }}
                          />
                        );
                      })
                    }
                  </div>
                </div>
                {
                  slicedImgs.length > 4 ? (
                    <div styleName="insert" style={isFlip ? { display: 'none' } : {}}>
                      <span
                        styleName={`btn-up ${arrowIndex < Math.floor(slicedImgs.length / 3) ? ' no-data' : ''}`}
                        onClick={() => {
                          if (!(arrowIndex < Math.floor(slicedImgs.length / 3))) {
                            this.arrow(-1);
                          }
                        }}
                      />
                      <span
                        styleName={`btn-down ${stateIndex >= Math.floor(slicedImgs.length / 3) ? 'no-data' : ''}`}
                        onClick={() => {
                          if (!(stateIndex >= Math.floor(slicedImgs.length / 3))) {
                            this.arrow(1);
                          }
                        }}
                      />
                    </div>
                  ) : null
                }
              </div>
            ) : null
          }
          {/* 主图 */}
          {
            !info.readyDeleted ? (
              <div
                styleName="image"
                data-postion={!(slicedImgs.length > 1)}
                style={ItemSize}
              >
                <div
                  styleName={`imgs-wrapper${disableAnimation ? '' : ' anim'}`}
                  onTransitionEnd={this.resetImgs}
                >
                  {
                    _imgs.map((img, i) => {
                      return (
                        <i
                          key={i}
                          style={{
                            ...filterStyle,
                            backgroundImage: `url(${adapterImgRule('item', 'detailPic', img)})`
                          }}
                          styleName={activeIndex === i ? 'active' : ''}
                          onClick={() => {
                            return false;
                          }}
                        />
                      );
                    })
                  }
                </div>
                <div styleName="btn-wrapper">
                  {/* 下载按钮 */}
                  <DownloadBtn
                    moduleName={moduleName}
                    info={info}
                    activeIndex={activeIndex}
                    _analyze={_analyze}
                  />
                  {/* 相似推荐按钮 */}
                  <FindSimilarBtn
                    className={styles.FindSimilar}
                    imgId={currentImgId}
                    moduleName={moduleName}
                    dataInfo={{
                      itemId: info && info.id,
                      imgId: currentImgId
                    }}
                  />
                </div>
              </div>
            ) : null
          }
          {/* 单品已删除 */}
          {
            info.readyDeleted && (
              <>
                <div styleName="no-item-img" />
                <p styleName="no-item-text">该单品已删除</p>
              </>
            )
          }
        </div>
      </div>
    );
  }
}

ItemFrame.propTypes = propTypes;
ItemFrame.defaultProps = defaultProps;

export default ItemFrame;
