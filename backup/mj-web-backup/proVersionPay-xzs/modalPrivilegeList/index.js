import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { generateObjectId } from 'Service/utilService';
import { getPrivilege } from '@src/core/global';
import { collectData, defineModuleName } from '@src/core/point';
import Button from '@src/widgets/button';
import Modal from '@src/widgets/modal';
import ModalDetail from './modalDetail';
import styles from './index.less';


/*
* 专业版权益介绍，老版新皮未重构
*  */

@defineModuleName('ProIntro')
export default class ModalPrivilegeList extends PureComponent {
  static contextTypes = {
    _analyze: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      board: 0,
      project: 0,
      autoMatting: 0,
      recreate: 0
    };
  }

  componentDidMount() {
    this.updateConfigData();
    this.___addToStorage();
  }

  updateConfigData = () => {
    getPrivilege().then(({ board, subject, autoMatting, recreate }) => {
      this.setState({
        board: board.config,
        project: subject.config,
        autoMatting: autoMatting.config,
        recreate: recreate.config
      });
    });
  }

  ___addToStorage = () => {
    const { _analyze } = this.context;
    _analyze({ // todo pupuu 埋点确认
      category: 'Pay',
      action: 'View',
      label: 'Open',
      value: ''
    });

    this.eventReferId = generateObjectId();
  }

  showIntroduce = type => {
    const { moduleName } = this.props;
    const { _analyze } = this.context;
    Modal.frame({
      content: (
        <ModalDetail
          type={type}
          moduleName={moduleName}
        />
      ),
      closeable: true,
      footer: false
    });
    // 打开弹窗
    _analyze({ // todo pupuu 埋点确认
      category: 'Pay',
      action: 'View',
      label: 'Media',
      value: type
    });

    collectData({ moduleName, key: 'clickViewMedia', info: { type } }); // todo pupuu 埋点确认
  }

  render() {
    const { close } = this.props;
    const { board, recreate, autoMatting, project } = this.state;
    return (
      <div styleName="modal-wrapper">
        <section styleName="aside-image" />
        <section styleName="content">
          <p styleName="l-title">
            <span styleName="s-1">普通用户</span>
            <span styleName="s-2">美间会员</span>
          </p>
          <div styleName="prof-ul">
            <div styleName="prof-li">
              <div styleName="l-1">
                <p>查看1000+高佣金品牌</p>
              </div>
              <div styleName="l-2"><i styleName="error" /></div>
              <div styleName="l-3"><i styleName="ok" /></div>
            </div>
            <div styleName="prof-li">
              <div styleName="l-1">
                <p>享受最低3.2折采购特权</p>
              </div>
              <div styleName="l-2"><i styleName="error" /></div>
              <div styleName="l-3"><i styleName="ok" /></div>
            </div>
            <div styleName="prof-li">
              <div styleName="l-1">
                <p>画布编辑与模板功能</p>
              </div>
              <div styleName="l-2"><i styleName="ok" /></div>
              <div styleName="l-3"><i styleName="ok" /></div>
            </div>
            <div styleName="prof-li">
              <div styleName="l-1">
                <p>海量素材使用</p>
              </div>
              <div styleName="l-2"><p>免费素材</p></div>
              <div styleName="l-3"><p>海量素材</p></div>
            </div>
            <div styleName="prof-li">
              <div styleName="l-1">
                <p>再创作功能</p>
              </div>
              <div styleName="l-2">{ recreate }次/月</div>
              <div styleName="l-3">无限</div>
            </div>
            <div styleName="prof-li">
              <div styleName="l-1">
                <p>拼图容量</p>
              </div>
              <div styleName="l-2"><p>{ board }张</p></div>
              <div styleName="l-3"><p>无限</p></div>
            </div>
            <div styleName="prof-li">
              <div styleName="l-1">
                <p>项目容量</p>
              </div>
              <div styleName="l-2"><p>{ project }个</p></div>
              <div styleName="l-3"><p>无限</p></div>
            </div>
            <div styleName="prof-li">
              <div styleName="l-1">
                <p>
                  <span>自动抠图功能</span>
                  <i
                    styleName="link"
                    onClick={() => {
                      this.showIntroduce('matting');
                    }}
                  />
                </p>
              </div>
              <div styleName="l-2"><p>{ autoMatting }次/月</p></div>
              <div styleName="l-3"><p>无限</p></div>
            </div>
            <div styleName="prof-li">
              <div styleName="l-1">
                <p>
                  <span>普清图片下载</span>
                </p>
              </div>
              <div styleName="l-2"><i styleName="ok" /></div>
              <div styleName="l-3"><i styleName="ok" /></div>
            </div>
            <div styleName="prof-li">
              <div styleName="l-1">
                <p>
                  <span>高清图片下载</span>
                  <i
                    styleName="link"
                    onClick={() => {
                      this.showIntroduce('HD');
                    }}
                  />
                </p>
              </div>
              <div styleName="l-2"><i styleName="error" /></div>
              <div styleName="l-3"><i styleName="ok" /></div>
            </div>
            <div styleName="prof-li">
              <div styleName="l-1">
                <p>
                  <span>导出Excel清单</span>
                  <i
                    styleName="link"
                    onClick={() => {
                      this.showIntroduce('Excel');
                    }}
                  />
                </p>
              </div>
              <div styleName="l-2"><i styleName="error" /></div>
              <div styleName="l-3"><i styleName="ok" /></div>
            </div>
            <div styleName="prof-li">
              <div styleName="l-1">
                <p>
                  <span>导出图文PDF</span>
                  <i
                    styleName="link"
                    onClick={() => {
                      this.showIntroduce('PDF');
                    }}
                  />
                </p>
              </div>
              <div styleName="l-2"><i styleName="error" /></div>
              <div styleName="l-3"><i styleName="ok" /></div>
            </div>
            <div styleName="prof-li">
              <div styleName="l-1">
                <p>
                  <span>“我的单品”智能筛选</span>
                  <i
                    styleName="link"
                    onClick={() => {
                      this.showIntroduce('filter');
                    }}
                  />
                </p>
              </div>
              <div styleName="l-2"><i styleName="error" /></div>
              <div styleName="l-3"><i styleName="ok" /></div>
            </div>
            <div styleName="prof-li">
              <div styleName="l-1">
                <p>佣金提现</p>
              </div>
              <div styleName="l-2"><i styleName="error" /></div>
              <div styleName="l-3"><i styleName="ok" /></div>
            </div>
          </div>
          <div styleName="footer">
            <Button
              theme="blue"
              className={styles.ok}
              onClick={close}
            >
              确定
            </Button>
          </div>
        </section>
      </div>
    );
  }
}
