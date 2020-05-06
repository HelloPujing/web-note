import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from './sectionTitle';
import styles from './ItemsPanel.less';

class ItemsPanel extends PureComponent {
  static contextTypes = {
    asideMode: PropTypes.number
  }

  render() {
    const { title, children } = this.props;
    const { asideMode } = this.context;
    return (
      <section styleName="items-panel" data-asidemode={asideMode}>
        <SectionTitle className={styles['items-title']} title={title} />
        {children}
      </section>
    );
  }
}

export default ItemsPanel;
