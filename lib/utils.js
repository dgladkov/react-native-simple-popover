const PLACEMENT_OPTIONS = {
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
  AUTO: 'auto',
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getArrowStyle = ({
  anchorPoint,
  popoverOrigin,
  arrowSize,
  placement,
}) => {
  let width;
  let height;
  // swap width and height for left/right positioned tooltips
  if (
    placement === PLACEMENT_OPTIONS.TOP ||
    placement === PLACEMENT_OPTIONS.BOTTOM
  ) {
    width = arrowSize.width;
    height = arrowSize.height * 2;
  } else {
    width = arrowSize.height * 2;
    height = arrowSize.width;
  }

  return {
    width,
    height,
    left: anchorPoint.x - popoverOrigin.x - width / 2,
    top: anchorPoint.y - popoverOrigin.y - height / 2,
    borderTopWidth: height / 2,
    borderRightWidth: width / 2,
    borderBottomWidth: height / 2,
    borderLeftWidth: width / 2,
    borderTopColor:
      placement === PLACEMENT_OPTIONS.TOP ? undefined : 'transparent',
    borderRightColor:
      placement === PLACEMENT_OPTIONS.RIGHT ? undefined : 'transparent',
    borderBottomColor:
      placement === PLACEMENT_OPTIONS.BOTTOM ? undefined : 'transparent',
    borderLeftColor:
      placement === PLACEMENT_OPTIONS.LEFT ? undefined : 'transparent',
  };
};

export {
  PLACEMENT_OPTIONS,
  capitalizeFirstLetter,
  getArrowStyle,
};
