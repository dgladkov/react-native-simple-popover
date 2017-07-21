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
    text: PropTypes.string.isRequired,
    arrowWidth: PropTypes.number,
    arrowHeight: PropTypes.number,
    placement: PropTypes.oneOf(['left', 'right', 'top', 'bottom', 'auto']),
    textStyle: Text.propTypes.style,
    containerStyle: ViewPropTypes.style,
  };

  static defaultProps = {
    children: null,
    isVisible: true,
    arrowWidth: 15,
    arrowHeight: 10,
    placement: 'auto',
    containerStyle: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 2,
    },
    textStyle: {
      color: 'black',
    },
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
    if (prevProps.isVisible !== this.props.isVisible && !this.props.isVisible) {
      this.unregisterSelf();
    } else {
      this.registerSelf();
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
          text,
          arrowWidth,
          arrowHeight,
          placement,
          textStyle,
          containerStyle,
        } = this.props;
        this.context.registerPopover(this._id, findNodeHandle(this._element), {
          text,
          arrowWidth,
          arrowHeight,
          placement,
          textStyle,
          containerStyle,
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
