import FORCE from '../FORCE';
import * as d3 from 'd3';
import { getDatalabelMap } from '../../utils/constants';
import { AUTOMATION_RISK_LABEL } from '../Controls/SortPanel';
type ActivateGraphViewProps = {
  prevPositions: React.MutableRefObject<{}>;
  width: number;
  height: number;
  axisValues: {
    x: { displayName: string; dataLabel: string };
    y: { displayName: string; dataLabel: string };
  };
  scale: number;
};

export const getMaxNodes = (nodes, dataLabel) =>
  Math.max(...nodes.map(d => d[dataLabel]));
export const getMinNodes = (nodes, dataLabel) =>
  Math.min(...nodes.map(d => d[dataLabel]));

export const getMedianNodes = (nodes, dataLabel) =>
  (getMaxNodes(nodes, dataLabel) - getMinNodes(nodes, dataLabel)) / 2;

const getAxisTranslate = ({ d, nodes, dataLabel, axisLength }) => {
  const min = getMinNodes(nodes, dataLabel);
  const max = getMaxNodes(nodes, dataLabel);
  return (axisLength * (d[dataLabel] - min)) / (max - min);
};

export const getGraphViewPositions = ({
  nodes,
  d,
  width,
  height,
  axisValues,
}) => {
  const DATALABEL_MAP = getDatalabelMap();
  const x = getAxisTranslate({
    d,
    nodes,
    dataLabel: DATALABEL_MAP[axisValues.x.displayName],
    axisLength: width,
  });
  const y = getAxisTranslate({
    d,
    nodes,
    dataLabel: DATALABEL_MAP[axisValues.y.displayName],
    axisLength: height,
  });
  return { x: x - width / 2, y: y - height / 2 };
};

export function activateGraphView({
  prevPositions,
  width,
  height,
  axisValues,
  scale,
}: ActivateGraphViewProps) {
  (FORCE as any).stopSimulation(true);
  setTimeout(() => {
    const DOMNodes = d3.selectAll('.node');
    const nodes = DOMNodes.data();

    DOMNodes.transition()
      .ease(d3.easeCubicInOut)
      .delay((d, i) => i * 0.3)
      .duration(700)
      .attr('transform', function(d: any) {
        // preserve previous positions to return to
        prevPositions.current[d.job] = d3.select(this).attr('transform');
        const { x, y } = getGraphViewPositions({
          nodes,
          d,
          width,
          height,
          axisValues,
        });
        return `translate(${(x / scale) * 0.7},${y * 0.7})`;
      });
  }, 0);
}

type DeactivateGraphViewProps = {
  prevPositions: React.MutableRefObject<{}>;
  restartSimulation: any;
};
export function deactivateGraphView({
  prevPositions,
  restartSimulation,
}: DeactivateGraphViewProps) {
  d3.selectAll('.node')
    .transition()
    .ease(d3.easeBackInOut)
    .delay((d, i) => i * 0.3)
    .duration(500)
    .attr('transform', (d: any) => {
      return prevPositions.current[d.job];
    });
  setTimeout(() => {
    restartSimulation();
  }, 400);
}

export const NUM_TICKS = 6;

export const reScaleAxes = ({ axisValues, nodes, setMargins, setLabels }) => {
  if (!nodes) {
    return null;
  }
  const boundingNodes = { top: null, right: null, bottom: null, left: null };

  // get the node, distance, and labels for the most extreme nodes
  document.querySelectorAll('.node').forEach(node => {
    const nodeIdx = +node.id.slice(5) - 1;
    const axisLabels = {
      x: nodes[nodeIdx][axisValues.x.dataLabel],
      y: nodes[nodeIdx][axisValues.y.dataLabel],
    };

    // multiply by 100 for any percent labels (automation risk)
    if (axisValues.x.dataLabel === AUTOMATION_RISK_LABEL) {
      axisLabels.x *= 100;
    }
    if (axisValues.y.dataLabel === AUTOMATION_RISK_LABEL) {
      axisLabels.y *= 100;
    }

    const nodeRect = node.getBoundingClientRect();

    // track the most extreme node so far (small for top/left, big for right/bottom)
    Object.entries(boundingNodes).forEach(([side, boundingNode]) => {
      if (
        !boundingNode ||
        (['top', 'left'].includes(side)
          ? boundingNode.distance > nodeRect[side]
          : boundingNode.distance < nodeRect[side])
      ) {
        boundingNodes[side] = {
          node,
          axisLabels,
          distance: nodeRect[side],
        };
      }
    });
  });

  // TODO: could get more accurate by using node centers to position axis labels
  // TODO: (top-bottom)/2, (right-left)/2

  const graphWidth = boundingNodes.right.distance - boundingNodes.left.distance;
  const graphHeight =
    boundingNodes.bottom.distance - boundingNodes.top.distance;

  const newMargins = {
    left: graphWidth / (NUM_TICKS - 1),
    top: graphHeight / (NUM_TICKS - 1),
  };

  const newLabels = {
    x: [...Array(NUM_TICKS)].map((d, idx) => {
      const tickLabel =
        (idx / NUM_TICKS) *
          (boundingNodes.right.axisLabels.x - boundingNodes.left.axisLabels.x) +
        boundingNodes.left.axisLabels.x;
      return formatTickLabel(tickLabel);
    }),
    y: [...Array(NUM_TICKS)].map((d, idx) => {
      const tickLabel =
        (-idx / NUM_TICKS) *
          (boundingNodes.top.axisLabels.y - boundingNodes.bottom.axisLabels.y) +
        boundingNodes.top.axisLabels.y;
      return formatTickLabel(tickLabel);
    }),
  };
  setMargins(newMargins);
  setLabels(newLabels);
};

function formatTickLabel(num: number) {
  if (num < 10) {
    return num.toFixed(1);
  } else if (num >= 10 && num < 1000) {
    return num.toFixed(0);
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}k`;
  }
}
