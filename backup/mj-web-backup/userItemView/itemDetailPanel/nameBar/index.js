import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './nameBar.less';

const propTypes = {
  name: PropTypes.string.isRequired
};

class NameBar extends PureComponent {
  render() {
    const { name } = this.props;

    return (
      <h1 styleName="item-name">
        {name}
      </h1>
    );
  }
}

NameBar.propTypes = propTypes;

export default NameBar;
