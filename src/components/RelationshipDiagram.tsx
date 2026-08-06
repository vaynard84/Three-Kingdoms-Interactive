import React from 'react';
import { EventDiagramNode, EventDiagramLink, FactionId } from '../types';

interface RelationshipDiagramProps {
  nodes: EventDiagramNode[];
  links: EventDiagramLink[];
}

const factionColors: Record<FactionId, { bg: string; text: string; border: string }> = {
  Wei: { bg: 'bg-blue-900', text: 'text-blue-100', border: 'border-blue-500' },
  Shu: { bg: 'bg-emerald-900', text: 'text-emerald-100', border: 'border-emerald-500' },
  Wu: { bg: 'bg-red-900', text: 'text-red-100', border: 'border-red-500' },
  Han: { bg: 'bg-amber-900', text: 'text-amber-100', border: 'border-amber-500' },
  Other: { bg: 'bg-purple-900', text: 'text-purple-100', border: 'border-purple-500' }
};

export const RelationshipDiagram: React.FC<RelationshipDiagramProps> = ({ nodes, links }) => {
  return (
    <div className="bg-amber-950/80 p-6 rounded-2xl border border-amber-800/80 shadow-xl my-6">
      <h4 className="font-serif font-bold text-amber-100 text-lg mb-2 flex items-center gap-2">
        <span>⚔️</span> Event Relationship Diagram
      </h4>
      <p className="text-xs text-amber-300/80 mb-6">
        A visual overview showing how key figures and forces interacted in this major event.
      </p>

      {/* Nodes list & links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Figures */}
        <div className="space-y-3">
          <h5 className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Key Figures Involved</h5>
          <div className="flex flex-wrap gap-2">
            {nodes.map(node => {
              const color = factionColors[node.faction] || factionColors.Other;
              return (
                <div
                  key={node.id}
                  className={`px-3 py-2 rounded-xl border ${color.bg} ${color.text} ${color.border} shadow-sm text-xs font-medium flex items-center gap-2`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>{node.label}</span>
                  <span className="text-[10px] opacity-75 bg-black/30 px-1.5 py-0.5 rounded">
                    {node.role}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interaction Actions */}
        <div className="space-y-3">
          <h5 className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Key Interactions</h5>
          <div className="space-y-2">
            {links.map((link, idx) => {
              const sourceNode = nodes.find(n => n.id === link.source)?.label || link.source;
              const targetNode = nodes.find(n => n.id === link.target)?.label || link.target;
              
              let actionBadge = 'bg-red-900/60 text-red-200 border-red-700/60';
              if (link.type === 'Allied With') actionBadge = 'bg-emerald-900/60 text-emerald-200 border-emerald-700/60';
              if (link.type === 'Advised') actionBadge = 'bg-blue-900/60 text-blue-200 border-blue-700/60';

              return (
                <div
                  key={idx}
                  className="bg-amber-900/30 p-2.5 rounded-xl border border-amber-800/50 text-xs text-amber-100 flex items-center justify-between"
                >
                  <span className="font-medium text-amber-200">{sourceNode}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] border font-sans font-semibold ${actionBadge}`}>
                    {link.label}
                  </span>
                  <span className="font-medium text-amber-200">{targetNode}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
