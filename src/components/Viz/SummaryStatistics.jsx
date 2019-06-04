import React, { useContext } from 'react';
import { ControlsContext } from '../Context/ContextProvider';
import SummaryBar from './SummaryBar';
const SummaryStatistics = props => {
  const { summaryStatistics, nodes } = props;
  const context = useContext(ControlsContext);
  const avgStatistic = (nodes, stat) =>
    nodes.reduce((tot, node) => tot + node[stat], 0) / nodes.length;

  // returns value between 0 and 1
  const normalize = (value, min, max) => (value - min) / (max - min);

  const { height, width } = context.state.svgBBox;

  console.log(summaryStatistics.salaryMed.min, summaryStatistics.salaryMed.max);

  const [avgLeft, avgRight] = [
    avgStatistic(nodes, 'yearsStudy'),
    avgStatistic(nodes, 'salaryMed'),
  ];

  const getHeight = (stat, avg) =>
    normalize(avg, summaryStatistics[stat].min, summaryStatistics[stat].max);
  const getHeightLog = (stat, avg) =>
    normalize(
      Math.log(avg),
      Math.log(summaryStatistics[stat].min),
      Math.log(summaryStatistics[stat].max),
    );

  // years of study seems to scale with log salary
  const [heightLeft, heightRight] = [
    getHeight('yearsStudy', avgLeft) * height,
    getHeightLog('salaryMed', avgRight) * height,
  ];

  const barWidth = 20;
  const labelLeft = 'Years of Study';
  const labelRight = 'Salary ($1,000 / year)';

  return (
    <svg>
      {/* left */}
      <SummaryBar
        // yScale={scaleLeft}
        value={avgLeft}
        x={0}
        y={height - heightLeft || 0}
        height={heightLeft || 0}
        width={barWidth}
        fill={'#2371ca'}
        label={labelLeft}
        labelColor={'rgba(255,255,255,0.98)'}
        valueColor={'rgba(0,0,0,0.98)'}
        decimals={1}
      />
      {/* right */}
      <SummaryBar
        value={avgRight}
        x={width - barWidth || 0}
        y={height - heightRight || 0}
        height={heightRight || 0}
        width={barWidth}
        fill={'forestgreen'}
        label={labelRight}
        labelColor={'rgba(255,255,255,0.98)'}
        valueColor={'rgba(0,0,0,0.98)'}
        decimals={0}
      />
    </svg>
  );
};

export default SummaryStatistics;
