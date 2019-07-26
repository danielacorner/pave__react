import FORCE from '../FORCE';
import { getGraphViewPositions } from './GraphViewAxes';
import * as d3 from 'd3';

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

export function activateGraphView({
  prevPositions,
  width,
  height,
  axisValues,
  scale,
}: ActivateGraphViewProps) {
  (FORCE as any).stopSimulation(true);
  setTimeout(() => {
    d3.selectAll('.node')
      .transition()
      .ease(d3.easeCubicInOut)
      .delay((d, i) => i * 0.3)
      .duration(700)
      .attr('transform', function(d: any) {
        // preserve previous positions to return to
        prevPositions.current[d.job] = d3.select(this).attr('transform');
        const { x, y } = getGraphViewPositions({
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
