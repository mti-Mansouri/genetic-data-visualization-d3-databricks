import { useEffect, useRef, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as d3 from 'd3';
import type { RootState } from '../app/store';
import { selectVariant } from '../features/genomics/genomicsSlice';

export default function VisualizationCanvas() {
  const [showGuide, setShowGuide] = useState(true);
  const d3Container = useRef<SVGSVGElement | null>(null);
  const dispatch = useDispatch();
  const { variants, selectedVariant } = useSelector((state: RootState) => state.genomics);
  
  const simulationRef = useRef<any>(null);
  const zoomRef = useRef<any>(null);

  const { nodes, links } = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];
    variants.forEach((v) => {
      const geneNode = { ...v, type: 'gene' };
      nodes.push(geneNode);
      v.phenotypes.forEach((p) => {
        const phenoNode = { id: `${v.id}-${p}`, name: p, type: 'phenotype' };
        nodes.push(phenoNode);
        links.push({ source: geneNode.id, target: phenoNode.id });
      });
    });
    return { nodes, links };
  }, [variants]);

  // 1. Initial Physics and Draw (Runs Once)
  useEffect(() => {
    if (!d3Container.current) return;
    const svg = d3.select(d3Container.current);
    const width = d3Container.current.clientWidth;
    const height = d3Container.current.clientHeight;

    svg.selectAll("*").remove();
    const g = svg.append("g");

    zoomRef.current = d3.zoom()
      .scaleExtent([0.2, 3])
      .on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoomRef.current);

    simulationRef.current = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(80));

    const link = g.append("g").selectAll("line").data(links).enter().append("line")
      .attr("stroke", "#f1f5f9").attr("stroke-width", 1.5);

    const node = g.append("g").selectAll("g").data(nodes).enter().append("g")
      .attr("class", "cursor-pointer")
      .on("click", (_event, d) => {
        if (d.type === 'gene') {
          // FIX: Pass the original Redux object, NOT the D3 physics node
          const original = variants.find(v => v.id === d.id);
          if (original) dispatch(selectVariant(original));
        }
      });

    node.append("circle")
      .attr("r", d => d.type === 'gene' ? 40 : 10)
      // Added a custom class "node-circle" to easily select them later
      .attr("class", d => `node-circle transition-all duration-300 ${d.type === 'gene' ? 'fill-white stroke-[3px] stroke-gray-200' : 'fill-gray-100 stroke-gray-200'}`);

    node.append("text")
      .text(d => d.gene || d.name)
      .attr("text-anchor", "middle")
      .attr("dy", d => d.type === 'gene' ? "0.35em" : "2.5em")
      .attr("class", d => `font-bold uppercase pointer-events-none tracking-tighter ${d.type === 'gene' ? 'text-[11px] fill-pin-charcoal' : 'text-[8px] fill-gray-400'}`);

    simulationRef.current.on("tick", () => {
      link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      node.attr("transform", d => `translate(${d.x}, ${d.y})`);
    });

    return () => simulationRef.current.stop();
  }, [nodes, links, dispatch, variants]);

  // 2. Dynamic Highlighting (Runs when selection changes, without restarting physics)
  useEffect(() => {
    if (!d3Container.current) return;
    d3.select(d3Container.current).selectAll(".node-circle")
      .attr("class", (d: any) => d.type === 'gene' 
        ? `node-circle transition-all duration-300 fill-white stroke-[3px] ${selectedVariant?.id === d.id ? 'stroke-pin-red shadow-xl' : 'stroke-gray-200'}`
        : 'node-circle fill-gray-100 stroke-gray-200');
  }, [selectedVariant]);

  // 3. Zoom Logic
  useEffect(() => {
    if (selectedVariant && d3Container.current && zoomRef.current) {
      const svg = d3.select(d3Container.current);
      const width = d3Container.current.clientWidth;
      const height = d3Container.current.clientHeight;

      const target = nodes.find(n => n.id === selectedVariant.id);
      if (target && target.x) {
        svg.transition().duration(1000).call(
          zoomRef.current.transform,
          d3.zoomIdentity.translate(width / 2, height / 2).scale(1.2).translate(-target.x, -target.y)
        );
      }
    }
  }, [selectedVariant, nodes]);

  return (
    <div className="w-full h-full bg-white relative overflow-hidden">
      <svg ref={d3Container} className="w-full h-full" />
      
{showGuide && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-white/50 text-pin-charcoal px-6 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center gap-4 md:gap-6 z-10 transition-all animate-in fade-in slide-in-from-bottom-4">
          <div className="flex gap-4 md:gap-6 text-[9px] md:text-[11px] font-bold tracking-wide">
             <span className="flex items-center gap-1.5"><span className="opacity-50 text-sm">🖱️</span> Select Gene</span>
             <span className="flex items-center gap-1.5"><span className="opacity-50 text-sm">🔍</span> Zoom</span>
             <span className="flex items-center gap-1.5"><span className="opacity-50 text-sm">🖐️</span> Pan</span>
          </div>
          {/* Vertical Divider */}
          <div className="w-px h-4 bg-gray-200"></div>
          <button 
            onClick={() => setShowGuide(false)} 
            className="text-gray-400 hover:text-pin-red transition-colors text-lg leading-none pb-0.5"
            aria-label="Close Guide"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}