import React, { Component } from 'react';
import { PanResponder, findNodeHandle, UIManager, View } from 'react-native';
import PropTypes from 'prop-types';
import PopoverElement from './PopoverElement';

const addKey = (obj, key, value) => ({ ...obj, [key]: value });

const delKey = (obj, key) => {
  const copy = Object.assign({}, obj);
  delete copy[key];
  return copy;
};

class PopoverContainer extends Component {
  static propTypes = {
    children: PropTypes.node,
    padding: PropTypes.number,
  };

  static defaultProps = {
    children: null,
    padding: 0,
  };

  static childContextTypes = {
    registerPopover: PropTypes.func,
    unregisterPopover: PropTypes.func,
  };

  state = {
    registry: {},
    containerSize: null,
  };

  getChildContext() {
    return {
      registerPopover: this.registerPopover,
      unregisterPopover: this.unregisterPopover,
    };
  }

  onRootLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    this.setState({ containerSize: { width, height } });
  };

  registerPopover = (id, element, props) => {
    UIManager.measureLayout(
      element,
      findNodeHandle(this._root),
      err => {
        console.error(err);
      },
      (x, y, width, height) => {
        this.setState({
          registry: addKey(this.state.registry, id, {
            rect: { x, y, width, height },
            props,
          }),
        });
      },
    );
  };

  unregisterPopover = id => {
    this.setState({ registry: delKey(this.state.registry, id) });
  };

  render() {
    return (
      <View
        ref={x => {
          this._root = x;
        }}
        style={{ flex: 1 }}
        onLayout={this.onRootLayout}
      >
        {this.props.children}
        {Object.entries(this.state.registry).map(([id, { rect, props }]) =>
          <PopoverElement
            key={id}
            containerSize={this.state.containerSize}
            padding={this.props.padding}
            fromRect={rect}
            {...props}
          />,
        )}
      </View>
    );
  }
}

export default PopoverContainer;
