import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { User, Connection } from 'src/shared/types/index';
import { useNetwork } from 'src/shared/contexts/index';
import Card from 'src/frontend/components/ui/Card';
import { COLORS } from 'src/shared/constants/index';
import classNames from 'classnames';

interface NetworkGraphProps {
  user: User;
  connections: Connection[];
  className?: string;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  isCurrentUser: boolean;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
}

const NetworkGraph: React.FC<NetworkGraphProps> = React.memo(({ user, connections, className }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { networkValue } = useNetwork();

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 400;

    // Create nodes and links data
    const nodes: Node[] = [
      { id: user.id, name: user.username, isCurrentUser: true },
      ...connections.map(conn => ({ id: conn.connectedUserId, name: conn.connectedUserId, isCurrentUser: false }))
    ];

    const links: Link[] = connections.map(conn => ({
      source: user.id,
      target: conn.connectedUserId
    }));

    // Set up SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove(); // Clear previous render

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-50))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', COLORS.ACCENT)
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1);

    // Create nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', d => d.isCurrentUser ? 8 : 5)
      .attr('fill', d => d.isCurrentUser ? COLORS.PRIMARY : COLORS.SECONDARY)
      .attr('stroke', COLORS.PRIMARY)
      .attr('stroke-width', 1)
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Add node labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .text(d => d.name)
      .attr('font-size', '10px')
      .attr('dx', 12)
      .attr('dy', 4);

    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!);

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);

      label
        .attr('x', d => d.x!)
        .attr('y', d => d.y!);
    });

    // Zoom and pan functionality
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [user, connections]);

  return (
    <Card className={classNames('p-4', className)}>
      <h2 className="text-xl font-bold mb-4">Your Network</h2>
      <svg ref={svgRef} className="w-full h-full" aria-label="Network graph visualization">
        <title>Network Graph</title>
        <desc>A visualization of your professional network connections</desc>
      </svg>
    </Card>
  );
});

export default NetworkGraph;