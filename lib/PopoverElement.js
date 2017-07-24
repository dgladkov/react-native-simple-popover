import React, { Component } from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import computeGeometry from './computeGeometry';

class PopoverElement extends Component {
  static propTypes = {
    containerSize: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }).isRequired,
    fromRect: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number,
    }).isRequired,
    padding: PropTypes.number.isRequired,
    arrowColor: PropTypes.string.isRequired,
    arrowWidth: PropTypes.number.isRequired,
    arrowHeight: PropTypes.number.isRequired,
    placement: PropTypes.oneOf(
      ['left', 'right', 'top', 'bottom', 'auto']
    ).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      // render offscren initially
      containerStyle: {
        top: -9999,
        left: -9999,
        maxWidth: this.props.containerSize.width - this.props.padding * 2,
        maxHeight: this.props.containerSize.height - this.props.padding * 2,
      },
      arrowStyle: null,
      width: 0,
      height: 0,
    };
  }

  computeStyles({
    arrowHeight,
    arrowWidth,
    containerSize,
    fromRect,
    padding,
    placement,
  }) {
    const { width, height } = this.state;
    const geom = computeGeometry({
      contentSize: { width, height },
      fromRect,
      containerSize,
      arrowSize: {
        width: arrowWidth,
        height: arrowHeight,
      },
      padding: padding,
      placement: placement,
    });
    this.setState({
      containerStyle: {
        ...this.state.containerStyle,
        top: geom.popoverOrigin.y,
        left: geom.popoverOrigin.x,
      },
      arrowStyle: geom.arrowStyle,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.computeStyles(nextProps);
    return false;
  }

  measureLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    this.setState({ width, height }, () => this.computeStyles(this.props));
  };

  render() {
    return (
      <View style={[styles.abs, this.state.containerStyle]}>
        <View onLayout={this.measureLayout}>
          {React.createElement(this.props.component)}
        </View>
        <View
          style={[
            styles.abs,
            this.state.arrowStyle,
            { borderColor: this.props.arrowColor },
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  abs: {
    position: 'absolute',
  },
});

export default PopoverElement;
