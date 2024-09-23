import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { User, ActivityData } from 'src/shared/types/index';
import { useNetwork } from 'src/shared/contexts/index';
import Card from 'src/frontend/components/ui/Card';
import { COLORS } from 'src/shared/constants/index';
import classNames from 'classnames';

interface ActivityChartProps {
  user: User;
  activityData: ActivityData[];
  className?: string;
}

const ActivityChart: React.FC<ActivityChartProps> = React.memo(({ user, activityData, className }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { getAdditionalNetworkData } = useNetwork();

  useEffect(() => {
    if (!svgRef.current || activityData.length === 0) return;

    const additionalData = getAdditionalNetworkData(user.id);
    const processedData = processActivityData(activityData, additionalData);

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    // Clear existing content
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(processedData, d => d.date) as [Date, Date])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.value) as number])
      .range([height, 0]);

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    g.append('g')
      .call(yAxis);

    // Create line generator
    const line = d3.line<ActivityData>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value));

    // Append activity line
    g.append('path')
      .datum(processedData)
      .attr('fill', 'none')
      .attr('stroke', COLORS.PRIMARY)
      .attr('stroke-width', 1.5)
      .attr('d', line);

    // Add data points
    g.selectAll('.data-point')
      .data(processedData)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value))
      .attr('r', 4)
      .attr('fill', COLORS.SECONDARY)
      .attr('stroke', COLORS.PRIMARY);

    // Implement hover effects and tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    g.selectAll('.data-point')
      .on('mouseover', (event, d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`Date: ${d.date.toLocaleDateString()}<br/>Value: ${d.value}`)
          .style('left', (event.pageX) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    // Implement zoom and pan
    const zoom = d3.zoom()
      .scaleExtent([1, 5])
      .translateExtent([[0, 0], [width, height]])
      .extent([[0, 0], [width, height]])
      .on('zoom', (event) => {
        const newXScale = event.transform.rescaleX(xScale);
        const newYScale = event.transform.rescaleY(yScale);
        g.select('.x-axis').call(xAxis.scale(newXScale));
        g.select('.y-axis').call(yAxis.scale(newYScale));
        g.select('.line').attr('d', line.x(d => newXScale(d.date)).y(d => newYScale(d.value)));
        g.selectAll('.data-point')
          .attr('cx', d => newXScale(d.date))
          .attr('cy', d => newYScale(d.value));
      });

    svg.call(zoom);

  }, [user, activityData, getAdditionalNetworkData]);

  const processActivityData = (data: ActivityData[], additionalData: any) => {
    // Process and combine activity data with additional network data
    // This is a placeholder implementation and should be adjusted based on actual data structure
    return data.map(item => ({
      ...item,
      value: item.value + (additionalData[item.date.toISOString()] || 0)
    }));
  };

  return (
    <Card className={classNames('activity-chart', className)}>
      <h2 className="text-xl font-bold mb-4">Network Activity</h2>
      <svg
        ref={svgRef}
        className="w-full h-64"
        aria-label="Network activity chart"
        role="img"
      >
        <title>Network Activity Over Time</title>
        <desc>A line chart showing the user's network activity over time</desc>
      </svg>
    </Card>
  );
});

export default ActivityChart;