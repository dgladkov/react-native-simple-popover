import React, { PureComponent } from 'react';
import { findNodeHandle, Text, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

class Popover extends PureComponent {
  static contextTypes = {
    registerPopover: PropTypes.func,
    unregisterPopover: PropTypes.func,
  };

  static propTypes = {
    children: PropTypes.node,
    isVisible: PropTypes.bool,
    arrowColor: PropTypes.string,
    arrowWidth: PropTypes.number,
    arrowHeight: PropTypes.number,
    placement: PropTypes.oneOf(['left', 'right', 'top', 'bottom', 'auto']),
  };

  static defaultProps = {
    children: null,
    isVisible: true,
    arrowColor: 'white',
    arrowWidth: 15,
    arrowHeight: 10,
    placement: 'auto',
  };

  constructor(props) {
    super(props);
    this._id = uuidv4();
  }

  componentDidMount() {
    if (!this.props.isVisible) {
      return;
    }
    this.registerSelf();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isVisible !== this.props.isVisible) {
      if (this.props.isVisible) {
        this.registerSelf();
      } else {
        this.unregisterSelf();
      }
    }
  }

  componentWillUnmount() {
    this.unregisterSelf();
  }

  setElementRef = x => {
    this._element = x;
  };

  registerSelf() {
    // delay to the next tick to guarantee layout
    setTimeout(() => {
      if (this._element !== null) {
        const {
          arrowColor,
          arrowWidth,
          arrowHeight,
          placement,
          component
        } = this.props;
        this.context.registerPopover(this._id, findNodeHandle(this._element), {
          arrowColor,
          arrowWidth,
          arrowHeight,
          placement,
          component
        });
      }
    });
  }

  unregisterSelf() {
    this.context.unregisterPopover(this._id);
  }

  render() {
    const child = React.Children.only(this.props.children);
    return React.cloneElement(child, {
      ref: this.setElementRef,
    });
  }
}

export default Popover;
