import FORCE from '../FORCE';
import * as d3 from 'd3';
import { getDatalabelMap } from '../../utils/constants';
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
