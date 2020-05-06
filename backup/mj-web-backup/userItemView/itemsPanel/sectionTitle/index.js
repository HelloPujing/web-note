import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import './sectionTitle.less';

export default class SectionTitle extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    children: PropTypes.element
  }

  static defaultProps = {
    className: null,
    title: null,
    type: null,
    children: null
  }

  render() {
    const { className, title, children, type } = this.props;
    return title ? (
      <p
        className={className}
        data-type={type}
        styleName="title"
      >
        {title}
        {children}
      </p>
    ) : null;
  }
}
