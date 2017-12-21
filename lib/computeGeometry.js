import { PLACEMENT_OPTIONS, getArrowStyle } from './utils';

function Point(x, y) {
  this.x = x;
  this.y = y;
}

const computeGeometry = ({
  contentSize,
  placement,
  fromRect,
  containerSize,
  arrowSize,
  padding,
}) => {
  const displayArea = {
    x: padding,
    y: padding,
    width: containerSize.width - padding * 2,
    height: containerSize.height - padding * 2,
  };

  const options = {
    displayArea,
    fromRect,
    contentSize,
    arrowSize,
  };

  switch (placement) {
    case PLACEMENT_OPTIONS.TOP:
      return computeTopGeometry(options);
    case PLACEMENT_OPTIONS.BOTTOM:
      return computeBottomGeometry(options);
    case PLACEMENT_OPTIONS.LEFT:
      return computeLeftGeometry(options);
    case PLACEMENT_OPTIONS.RIGHT:
      return computeRightGeometry(options);
    default:
      return computeAutoGeometry(options);
  }
};

const computeTopGeometry = ({
  displayArea,
  fromRect,
  contentSize,
  arrowSize,
}) => {
  const popoverOrigin = new Point(
    Math.min(
      displayArea.x + displayArea.width - contentSize.width,
      Math.max(
        displayArea.x,
        fromRect.x + (fromRect.width - contentSize.width) / 2,
      ),
    ),
    fromRect.y - contentSize.height - arrowSize.height,
  );

  const anchorPoint = new Point(fromRect.x + fromRect.width / 2.0, fromRect.y);
  const arrowStyle = getArrowStyle({
    anchorPoint,
    popoverOrigin,
    arrowSize,
    placement: PLACEMENT_OPTIONS.TOP,
  });

  return {
    popoverOrigin,
    arrowStyle,
    placement: PLACEMENT_OPTIONS.TOP,
  };
};

const computeBottomGeometry = ({
  displayArea,
  fromRect,
  contentSize,
  arrowSize,
}) => {
  const popoverOrigin = new Point(
    Math.min(
      displayArea.x + displayArea.width - contentSize.width,
      Math.max(
        displayArea.x,
        fromRect.x + (fromRect.width - contentSize.width) / 2,
      ),
    ),
    fromRect.y + fromRect.height + arrowSize.height,
  );

  const anchorPoint = new Point(
    fromRect.x + fromRect.width / 2.0,
    fromRect.y + fromRect.height,
  );
  const arrowStyle = getArrowStyle({
    anchorPoint,
    popoverOrigin,
    arrowSize,
    placement: PLACEMENT_OPTIONS.BOTTOM,
  });

  return {
    popoverOrigin,
    arrowStyle,
    placement: PLACEMENT_OPTIONS.BOTTOM,
  };
};

const computeLeftGeometry = ({
  displayArea,
  fromRect,
  contentSize,
  arrowSize,
}) => {
  const popoverOrigin = new Point(
    fromRect.x - contentSize.width - arrowSize.height,
    Math.min(
      displayArea.y + displayArea.height - contentSize.height,
      Math.max(
        displayArea.y,
        fromRect.y + (fromRect.height - contentSize.height) / 2,
      ),
    ),
  );

  const anchorPoint = new Point(fromRect.x, fromRect.y + fromRect.height / 2.0);
  const arrowStyle = getArrowStyle({
    anchorPoint,
    popoverOrigin,
    arrowSize,
    placement: PLACEMENT_OPTIONS.LEFT,
  });

  return {
    popoverOrigin,
    arrowStyle,
    placement: PLACEMENT_OPTIONS.LEFT,
  };
};

const computeRightGeometry = ({
  displayArea,
  fromRect,
  contentSize,
  arrowSize,
}) => {
  const popoverOrigin = new Point(
    fromRect.x + fromRect.width + arrowSize.height,
    Math.min(
      displayArea.y + displayArea.height - contentSize.height,
      Math.max(
        displayArea.y,
        fromRect.y + (fromRect.height - contentSize.height) / 2,
      ),
    ),
  );

  const anchorPoint = new Point(
    fromRect.x + fromRect.width,
    fromRect.y + fromRect.height / 2.0,
  );
  const arrowStyle = getArrowStyle({
    anchorPoint,
    popoverOrigin,
    arrowSize,
    placement: PLACEMENT_OPTIONS.RIGHT,
  });

  return {
    popoverOrigin,
    arrowStyle,
    placement: PLACEMENT_OPTIONS.RIGHT,
  };
};

const computeAutoGeometry = ({
  displayArea,
  fromRect,
  contentSize,
  arrowSize,
}) => {
  const placementsToTry = [
    computeLeftGeometry,
    computeRightGeometry,
    computeBottomGeometry,
    computeTopGeometry,
  ];

  let geom;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < placementsToTry.length; i++) {
    const placementFn = placementsToTry[i];
    geom = placementFn({ displayArea, fromRect, contentSize, arrowSize });
    const { popoverOrigin } = geom;

    if (
      popoverOrigin.x >= displayArea.x &&
      popoverOrigin.x <=
        displayArea.x + displayArea.width - contentSize.width &&
      popoverOrigin.y >= displayArea.y &&
      popoverOrigin.y <= displayArea.y + displayArea.height - contentSize.height
    ) {
      break;
    }
  }

  return geom;
};

export default computeGeometry;
