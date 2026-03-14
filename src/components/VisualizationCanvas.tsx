import { useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as d3 from 'd3';
import type { RootState } from '../app/store';
import { selectVariant } from '../features/genomics/genomicsSlice';

export default function VisualizationCanvas() {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const dispatch = useDispatch();
  
  const { activeCaseId, casesCache, selectedVariant } = useSelector((state: RootState) => state.genomics);
  const activeCase = activeCaseId ? casesCache[activeCaseId] : null;

  // Transform Case Data into D3 Nodes/Links
  const { nodes, links } = useMemo(() => {
    if (!activeCase) return { nodes: [], links: [] };

    const nodes: any[] = [{ id: 'patient', name: activeCase.patientName, type: 'patient' }];
    const links: any[] = [];

    activeCase.variants.forEach((v) => {
      nodes.push({ ...v, type: 'variant' });
      links.push({ source: 'patient', target: v.id, value: 160 });

      v.phenotypes.forEach((p) => {
        const phenoId = `pheno-${v.id}-${p}`;
        nodes.push({ id: phenoId, name: p, type: 'phenotype' });
        links.push({ source: v.id, target: phenoId, value: 60 });
      });
    });

    return { nodes, links };
  }, [activeCase]);

  // EFFECT 1: Build the Graph & Run Physics (Only runs when the CASE changes)
  useEffect(() => {
    if (!d3Container.current || nodes.length === 0) return;

    const svg = d3.select(d3Container.current);
    const width = d3Container.current.clientWidth;
    const height = d3Container.current.clientHeight;

    svg.selectAll("*").remove();
    const g = svg.append("g");

    const zoom = d3.zoom().scaleExtent([0.5, 4]).on("zoom", (e) => g.attr("transform", e.transform));
    svg.call(zoom as any);

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance((d: any) => d.value))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(70));

    const link = g.append("g").selectAll("line").data(links).enter().append("line")
      .attr("stroke", "#f0f0f0").attr("stroke-width", 2);

    const node = g.append("g").selectAll("g").data(nodes).enter().append("g")
      .style("cursor", d => d.type === 'variant' ? 'pointer' : 'default')
      .on("click", (_e, d: any) => {
        if (d.type === 'variant') {
          // Strip D3 properties to protect Redux state
          const cleanVariant = {
            id: d.id,
            gene: d.gene,
            mutation: d.mutation,
            impact: d.impact,
            phenotypes: d.phenotypes,
            severity: d.severity
          };
          dispatch(selectVariant(cleanVariant));
        }
      });

    node.append("circle")
      .attr("r", d => d.type === 'patient' ? 45 : d.type === 'variant' ? 32 : 8)
      // Base styling applied here. Notice we added a "variant-node" class to target later.
      .attr("class", d => {
        if (d.type === 'patient') return "fill-pin-charcoal";
        if (d.type === 'variant') return "variant-node fill-white stroke-[3px] stroke-gray-200 hover:stroke-gray-400 transition-colors duration-300";
        return "fill-gray-300";
      });

    node.append("text")
      .text(d => d.gene || d.name)
      .attr("text-anchor", "middle")
      .attr("dy", d => d.type === 'phenotype' ? "2.5em" : "0.35em")
      .attr("class", d => `font-black uppercase tracking-tighter pointer-events-none ${d.type === 'patient' ? 'text-[10px] fill-white' : 'text-[9px] fill-gray-600'}`);

    simulation.on("tick", () => {
      link.attr("x1", d => (d.source as any).x).attr("y1", d => (d.source as any).y)
          .attr("x2", d => (d.target as any).x).attr("y2", d => (d.target as any).y);
      node.attr("transform", d => `translate(${(d as any).x}, ${(d as any).y})`);
    });

    return () => simulation.stop();
  }, [nodes, links, dispatch]); // Notice: selectedVariant is GONE from this dependency array

  // EFFECT 2: Update Selection Styling (Only runs when YOU CLICK a variant)
  useEffect(() => {
    if (!d3Container.current) return;
    
    // We reach into the SVG and only update the classes of the nodes based on the new Redux state
    d3.select(d3Container.current)
      .selectAll(".variant-node")
      .attr("class", (d: any) => 
        `variant-node fill-white stroke-[3px] transition-colors duration-300 ${
          selectedVariant?.id === d.id ? 'stroke-pin-red' : 'stroke-gray-200 hover:stroke-gray-400'
        }`
      );
  }, [selectedVariant]);

  return <svg ref={d3Container} className="w-full h-full" />;
}