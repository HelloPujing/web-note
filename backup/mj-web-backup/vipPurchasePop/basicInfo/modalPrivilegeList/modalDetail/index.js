import React from 'react';
import PropTypes from 'prop-types';
import './index.less';

/*
* 权益详情介绍，老版新皮未重构
*  */

const INTRPDUCE_DETAIL = [
  {
    type: 'matting',
    h: '自动抠图功能',
    p: [
      '普通用户，每人每月可使用20次自动抠图功能。当月到达上限后需成为美间会员才能继续使用。',
      '目前抠图功能能够帮助用户在上传自己的单品或者使用他人单品时，去除单色或渐变的图片背景，包括大部分镂空素材。复杂场景图背景尚无法去除。'
    ],
    sourceType: 'video',
    url: `${RESOURCE_HOST}/resource/video/ogg/mapping.ogg`
  },
  {
    type: 'HD',
    h: '高清大图像素比较',
    p: [
      '普通用户可以导出标清图片。美间会员，可以导出高清大图。',
      '下图中左图为高清大图，右图为标清图片。',
      '若需要放到作品集中，或向他人展示时，建议使用高清大图，画质更细腻。'
    ],
    sourceType: 'img',
    url: `${CDN_IMAGES_HOST}/static/public/bijiao.jpg`
  },
  {
    type: 'Excel',
    h: 'Excel样式参考',
    p: [
      '美间会员可以导出Excel格式的清单。Excel中导出的内容和清单中填写的内容是一致的。',
      '需要下次继续使用的，可以在清单页面中填写，填写的单品信息会保存在云端。如果是自己上传的单品，下次使用到这个单品时，填写过的信息不用重复填写。'
    ],
    sourceType: 'video',
    url: `${RESOURCE_HOST}/resource/video/ogg/export_excel.ogg`
  },
  {
    type: 'PDF',
    h: '图文PDF格式样式参考',
    p: [
      '美间会员可以导出PDF格式的清单。PDF清单支持选择是否需要包含价格和拼图图片，具体可在清单编辑页面中修改。'
    ],
    sourceType: 'video',
    url: `${RESOURCE_HOST}/resource/video/ogg/export_pdf.ogg`
  },
  {
    type: 'filter',
    h: '智能筛选功能介绍',
    p: [
      '美间会员可以使用智能筛选功能。收藏和上传的单品可以在使用时，根据分类，颜色等快速筛选。'
    ],
    sourceType: 'video',
    url: `${RESOURCE_HOST}/resource/video/ogg/filter.ogg`
  }
];
const TYPE_LIST = ['matting', 'HD', 'Excel', 'PDF', 'filter'];

export default class IntroduceProfession extends React.PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(TYPE_LIST).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      curIndex: TYPE_LIST.indexOf(props.type)
    };
  }


  nextIntroduce = () => {
    this.setState(
      prevState => {
        return {
          curIndex: prevState.curIndex + 1
        };
      }
    );
  };

  prevIntroduce = () => {
    this.setState(
      prevState => {
        return {
          curIndex: prevState.curIndex - 1
        };
      }
    );
  };

  render() {
    const { curIndex } = this.state;
    const detail = INTRPDUCE_DETAIL[curIndex];
    return (
      <div styleName="profession-introduce">
        {curIndex !== 0 ? (
          <i styleName="prev-btn" onClick={this.prevIntroduce} />
        ) : null}
        {curIndex !== INTRPDUCE_DETAIL.length - 1 ? (
          <i styleName="next-btn" onClick={this.nextIntroduce} />
        ) : null}
        <div styleName="content">
          <h3>{detail.h}</h3>
          {detail.p.map((text, i) => {
            return <p key={i}>{text}</p>;
          })}
          {detail.sourceType === 'video' ? (
            <div styleName="video-wrapper">
              <video
                key={detail.type}
                src={detail.url}
                width="100%"
                height="100%"
                autoPlay
                controls
              >
                <p>您的浏览器不支持该视频播放</p>
                <p>请升级您的浏览器至最新版本</p>
                <track kind="captions" />
              </video>
            </div>
          ) : (
            <img
              src={detail.url}
              draggable={false}
              style={{
                width: '100%'
              }}
              alt="权益"
            />
          )}
        </div>
      </div>
    );
  }
}
