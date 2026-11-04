import React, { useState, useMemo } from 'react';
import { ArrowRight, Info, Filter } from 'lucide-react';

export default function BookingJourneySankey({ bookings = [], onNavigateWithFilter }) {
  const [hoveredRibbon, setHoveredRibbon] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Group bookings into Categories & Outcomes
  const { totalCount, categories, outcomes, flows } = useMemo(() => {
    const total = bookings.length;

    // 1. Categories
    // Group categories into: 'Darshan', 'Pooja & Seva' (Archana, Abhishekam, Havan), 'Other Services'
    const catBuckets = {
      Darshan: { id: 'cat-darshan', label: 'Darshan', count: 0, color: '#D97706', rawCategories: ['Darshan'] },
      'Pooja & Seva': {
        id: 'cat-pooja',
        label: 'Pooja & Seva',
        count: 0,
        color: '#8C3220',
        rawCategories: ['Archana', 'Abhishekam', 'Havan', 'Special Ritual'],
      },
      'Other Services': {
        id: 'cat-other',
        label: 'Other Services',
        count: 0,
        color: '#B68A36',
        rawCategories: ['Other Sevas', 'General'],
      },
    };

    // 2. Outcomes
    const outcomeBuckets = {
      Completed: { id: 'out-completed', label: 'Completed', count: 0, color: '#059669', statusMatch: ['Completed'] },
      'Confirmed / Active': {
        id: 'out-confirmed',
        label: 'Confirmed / Active',
        count: 0,
        color: '#0284C7',
        statusMatch: ['Confirmed', 'Active', 'Scheduled'],
      },
      Pending: { id: 'out-pending', label: 'Pending', count: 0, color: '#D97706', statusMatch: ['Pending'] },
      Cancelled: {
        id: 'out-cancelled',
        label: 'Cancelled',
        count: 0,
        color: '#E11D48',
        statusMatch: ['Cancelled', 'Rejected', 'Cancellation Requested'],
      },
    };

    // Matrix of flows: categoryKey -> outcomeKey -> count
    const flowMatrix = {};
    Object.keys(catBuckets).forEach((catKey) => {
      flowMatrix[catKey] = {};
      Object.keys(outcomeBuckets).forEach((outKey) => {
        flowMatrix[catKey][outKey] = 0;
      });
    });

    bookings.forEach((b) => {
      // Find matching category
      let matchedCat = 'Other Services';
      if (b.category === 'Darshan') {
        matchedCat = 'Darshan';
      } else if (['Archana', 'Abhishekam', 'Havan', 'Special Ritual'].includes(b.category)) {
        matchedCat = 'Pooja & Seva';
      }

      // Find matching outcome
      let matchedOut = 'Confirmed / Active';
      if (b.status === 'Completed') {
        matchedOut = 'Completed';
      } else if (['Confirmed', 'Active', 'Scheduled'].includes(b.status)) {
        matchedOut = 'Confirmed / Active';
      } else if (b.status === 'Pending') {
        matchedOut = 'Pending';
      } else if (['Cancelled', 'Rejected', 'Cancellation Requested'].includes(b.status)) {
        matchedOut = 'Cancelled';
      }

      catBuckets[matchedCat].count += 1;
      outcomeBuckets[matchedOut].count += 1;
      flowMatrix[matchedCat][matchedOut] += 1;
    });

    return {
      totalCount: total,
      categories: Object.values(catBuckets),
      outcomes: Object.values(outcomeBuckets),
      flows: flowMatrix,
    };
  }, [bookings]);

  // SVG Geometry Dimensions
  const svgWidth = 840;
  const svgHeight = 290;
  const colX = {
    total: 30,
    categories: 300,
    outcomes: 630,
  };
  const nodeWidth = 145;
  const availableHeight = 250;
  const topPadding = 20;

  // Layout node positions proportionally based on count
  // 1. Total node
  const totalNode = {
    x: colX.total,
    y: topPadding + 40,
    width: nodeWidth,
    height: Math.max(70, Math.min(130, (totalCount / Math.max(1, totalCount)) * availableHeight)),
    label: 'Total Bookings',
    count: totalCount,
    percent: 100,
    color: '#55132D',
  };

  // 2. Category nodes
  const categoryNodes = useMemo(() => {
    let currentY = topPadding;
    const gap = 16;
    const totalGaps = gap * (categories.length - 1);
    const usableH = availableHeight - totalGaps;

    return categories.map((cat) => {
      const share = totalCount > 0 ? cat.count / totalCount : 1 / categories.length;
      const height = Math.max(48, Math.round(share * usableH));
      const node = {
        ...cat,
        x: colX.categories,
        y: currentY,
        width: nodeWidth,
        height,
        percent: totalCount > 0 ? ((cat.count / totalCount) * 100).toFixed(1) : '0.0',
      };
      currentY += height + gap;
      return node;
    });
  }, [categories, totalCount]);

  // 3. Outcome nodes
  const outcomeNodes = useMemo(() => {
    let currentY = topPadding;
    const gap = 12;
    const totalGaps = gap * (outcomes.length - 1);
    const usableH = availableHeight - totalGaps;

    return outcomes.map((out) => {
      const share = totalCount > 0 ? out.count / totalCount : 1 / outcomes.length;
      const height = Math.max(42, Math.round(share * usableH));
      const node = {
        ...out,
        x: colX.outcomes,
        y: currentY,
        width: nodeWidth,
        height,
        percent: totalCount > 0 ? ((out.count / totalCount) * 100).toFixed(1) : '0.0',
      };
      currentY += height + gap;
      return node;
    });
  }, [outcomes, totalCount]);

  // Compute Ribbons: Total -> Categories
  const totalToCategoryRibbons = useMemo(() => {
    let sourceOffset = 0;
    return categoryNodes.map((catNode) => {
      const shareInTotal = totalCount > 0 ? catNode.count / totalCount : 0;
      const ribbonHeight = Math.max(4, Math.round(shareInTotal * totalNode.height));
      const y0 = totalNode.y + sourceOffset;
      const y1 = catNode.y + catNode.height / 2 - ribbonHeight / 2;
      sourceOffset += ribbonHeight;

      const x0 = totalNode.x + totalNode.width;
      const x1 = catNode.x;
      const midX = (x0 + x1) / 2;

      const path = `
        M ${x0} ${y0}
        C ${midX} ${y0}, ${midX} ${y1}, ${x1} ${y1}
        L ${x1} ${y1 + ribbonHeight}
        C ${midX} ${y1 + ribbonHeight}, ${midX} ${y0 + ribbonHeight}, ${x0} ${y0 + ribbonHeight}
        Z
      `;

      return {
        id: `ribbon-total-${catNode.id}`,
        source: 'Total Bookings',
        target: catNode.label,
        count: catNode.count,
        percent: catNode.percent,
        color: catNode.color,
        path,
        catKey: catNode.label,
      };
    });
  }, [categoryNodes, totalNode, totalCount]);

  // Compute Ribbons: Categories -> Outcomes
  const categoryToOutcomeRibbons = useMemo(() => {
    const ribbons = [];
    const catOffsets = {};
    const outOffsets = {};

    categoryNodes.forEach((c) => {
      catOffsets[c.label] = 0;
    });
    outcomeNodes.forEach((o) => {
      outOffsets[o.label] = 0;
    });

    categoryNodes.forEach((catNode) => {
      outcomeNodes.forEach((outNode) => {
        const flowCount = flows[catNode.label]?.[outNode.label] || 0;
        if (flowCount <= 0) return;

        // Fraction of category node height
        const catShare = catNode.count > 0 ? flowCount / catNode.count : 0;
        const h0 = Math.max(3, Math.round(catShare * catNode.height));

        // Fraction of outcome node height
        const outShare = outNode.count > 0 ? flowCount / outNode.count : 0;
        const h1 = Math.max(3, Math.round(outShare * outNode.height));

        const y0 = catNode.y + (catOffsets[catNode.label] || 0);
        const y1 = outNode.y + (outOffsets[outNode.label] || 0);

        catOffsets[catNode.label] = (catOffsets[catNode.label] || 0) + h0;
        outOffsets[outNode.label] = (outOffsets[outNode.label] || 0) + h1;

        const x0 = catNode.x + catNode.width;
        const x1 = outNode.x;
        const midX = (x0 + x1) / 2;

        const path = `
          M ${x0} ${y0}
          C ${midX} ${y0}, ${midX} ${y1}, ${x1} ${y1}
          L ${x1} ${y1 + h1}
          C ${midX} ${y1 + h1}, ${midX} ${y0 + h0}, ${x0} ${y0 + h0}
          Z
        `;

        const percentOfCat = catNode.count > 0 ? ((flowCount / catNode.count) * 100).toFixed(1) : 0;
        const percentOfTotal = totalCount > 0 ? ((flowCount / totalCount) * 100).toFixed(1) : 0;

        ribbons.push({
          id: `flow-${catNode.id}-${outNode.id}`,
          source: catNode.label,
          target: outNode.label,
          count: flowCount,
          percentOfCat,
          percentOfTotal,
          color: catNode.color,
          targetColor: outNode.color,
          path,
          catKey: catNode.label,
          outKey: outNode.label,
        });
      });
    });

    return ribbons;
  }, [categoryNodes, outcomeNodes, flows, totalCount]);

  // Handle drilldown navigation on node click
  const handleNodeClick = (type, value) => {
    if (!onNavigateWithFilter) return;
    if (type === 'category') {
      onNavigateWithFilter({ category: value, status: 'All' });
    } else if (type === 'outcome') {
      // Map outcome label to exact status filter
      const statusMap = {
        Completed: 'Completed',
        'Confirmed / Active': 'Confirmed',
        Pending: 'Pending',
        Cancelled: 'Cancelled',
      };
      onNavigateWithFilter({ status: statusMap[value] || value, category: 'All' });
    } else if (type === 'total') {
      onNavigateWithFilter({ category: 'All', status: 'All' });
    }
  };

  const handleRibbonClick = (ribbon) => {
    if (!onNavigateWithFilter) return;
    const statusMap = {
      Completed: 'Completed',
      'Confirmed / Active': 'Confirmed',
      Pending: 'Pending',
      Cancelled: 'Cancelled',
    };
    onNavigateWithFilter({
      category: ribbon.catKey || 'All',
      status: statusMap[ribbon.outKey] || 'All',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-4 sm:p-5 flex flex-col justify-between">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-150 gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#55132D]" />
            <h2 className="text-sm sm:text-base font-bold text-stone-900 font-serif">
              Booking Journey Flow
            </h2>
            <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
              Sankey Allocation Flow
            </span>
          </div>
          <p className="text-[11.5px] text-stone-500 mt-0.5">
            Traces complete devotee booking journey from intake volume through service categories to final outcomes.
          </p>
        </div>

        <div className="text-[11px] text-stone-500 flex items-center gap-1.5 self-start sm:self-auto">
          <Info className="w-3.5 h-3.5 text-stone-400" />
          <span>Click any ribbon or node to filter bookings</span>
        </div>
      </div>

      {/* SVG Container with Responsive viewBox */}
      <div className="w-full overflow-x-auto custom-scrollbar py-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full min-w-[760px] h-auto select-none"
          style={{ maxHeight: '310px' }}
        >
          <defs>
            {/* Gradients for Ribbons */}
            {categoryToOutcomeRibbons.map((ribbon) => (
              <linearGradient
                key={`grad-${ribbon.id}`}
                id={`grad-${ribbon.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={ribbon.color} stopOpacity="0.45" />
                <stop offset="100%" stopColor={ribbon.targetColor} stopOpacity="0.55" />
              </linearGradient>
            ))}
            {totalToCategoryRibbons.map((ribbon) => (
              <linearGradient
                key={`grad-${ribbon.id}`}
                id={`grad-${ribbon.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#55132D" stopOpacity="0.45" />
                <stop offset="100%" stopColor={ribbon.color} stopOpacity="0.55" />
              </linearGradient>
            ))}
          </defs>

          {/* Ribbons: Total -> Categories */}
          <g id="ribbons-total">
            {totalToCategoryRibbons.map((ribbon) => {
              const isHovered = hoveredRibbon?.id === ribbon.id;
              return (
                <path
                  key={ribbon.id}
                  d={ribbon.path}
                  fill={`url(#grad-${ribbon.id})`}
                  className="transition-all duration-200 cursor-pointer"
                  style={{
                    opacity: hoveredRibbon && !isHovered ? 0.2 : isHovered ? 0.9 : 0.6,
                    stroke: isHovered ? ribbon.color : 'none',
                    strokeWidth: isHovered ? 1.5 : 0,
                  }}
                  onMouseEnter={() => setHoveredRibbon(ribbon)}
                  onMouseLeave={() => setHoveredRibbon(null)}
                  onClick={() => handleRibbonClick(ribbon)}
                />
              );
            })}
          </g>

          {/* Ribbons: Categories -> Outcomes */}
          <g id="ribbons-flows">
            {categoryToOutcomeRibbons.map((ribbon) => {
              const isHovered = hoveredRibbon?.id === ribbon.id;
              return (
                <path
                  key={ribbon.id}
                  d={ribbon.path}
                  fill={`url(#grad-${ribbon.id})`}
                  className="transition-all duration-200 cursor-pointer"
                  style={{
                    opacity: hoveredRibbon && !isHovered ? 0.2 : isHovered ? 0.95 : 0.6,
                    stroke: isHovered ? ribbon.color : 'none',
                    strokeWidth: isHovered ? 1.5 : 0,
                  }}
                  onMouseEnter={() => setHoveredRibbon(ribbon)}
                  onMouseLeave={() => setHoveredRibbon(null)}
                  onClick={() => handleRibbonClick(ribbon)}
                />
              );
            })}
          </g>

          {/* 1. Total Node */}
          <g
            className="cursor-pointer group"
            onClick={() => handleNodeClick('total', 'All')}
            onMouseEnter={() => setHoveredNode(totalNode)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <rect
              x={totalNode.x}
              y={totalNode.y}
              width={totalNode.width}
              height={totalNode.height}
              rx={10}
              fill="#55132D"
              className="transition-transform group-hover:scale-[1.02] duration-200"
              filter="drop-shadow(0 2px 4px rgba(85, 19, 45, 0.2))"
            />
            <rect
              x={totalNode.x + 4}
              y={totalNode.y + 4}
              width={4}
              height={totalNode.height - 8}
              rx={2}
              fill="#E2BC6B"
            />
            <text
              x={totalNode.x + 16}
              y={totalNode.y + 24}
              fill="#E2BC6B"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
              letterSpacing="0.05em"
            >
              TOTAL INTAKE
            </text>
            <text
              x={totalNode.x + 16}
              y={totalNode.y + 48}
              fill="#FFFFFF"
              fontSize="19"
              fontWeight="bold"
              fontFamily="serif"
            >
              {totalNode.count.toLocaleString()}
            </text>
            <text
              x={totalNode.x + 16}
              y={totalNode.y + 66}
              fill="#F5EBE1"
              fontSize="10"
              fontFamily="sans-serif"
              opacity="0.85"
            >
              100% Bookings
            </text>
          </g>

          {/* 2. Category Nodes */}
          {categoryNodes.map((node) => {
            return (
              <g
                key={node.id}
                className="cursor-pointer group"
                onClick={() => handleNodeClick('category', node.label)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx={9}
                  fill="#FFFFFF"
                  stroke={node.color}
                  strokeWidth={2}
                  className="transition-transform group-hover:scale-[1.02] duration-200"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
                />
                <rect
                  x={node.x + 3}
                  y={node.y + 3}
                  width={5}
                  height={node.height - 6}
                  rx={2}
                  fill={node.color}
                />
                <text
                  x={node.x + 14}
                  y={node.y + Math.min(22, node.height / 2 + 1)}
                  fill="#1C1917"
                  fontSize="11.5"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {node.label}
                </text>
                {node.height > 44 && (
                  <text
                    x={node.x + 14}
                    y={node.y + Math.min(38, node.height - 8)}
                    fill={node.color}
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {node.count} <tspan fill="#78716C" fontSize="10">({node.percent}%)</tspan>
                  </text>
                )}
              </g>
            );
          })}

          {/* 3. Outcome Nodes */}
          {outcomeNodes.map((node) => {
            return (
              <g
                key={node.id}
                className="cursor-pointer group"
                onClick={() => handleNodeClick('outcome', node.label)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx={9}
                  fill="#FFFFFF"
                  stroke={node.color}
                  strokeWidth={2}
                  className="transition-transform group-hover:scale-[1.02] duration-200"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
                />
                <rect
                  x={node.x + 3}
                  y={node.y + 3}
                  width={5}
                  height={node.height - 6}
                  rx={2}
                  fill={node.color}
                />
                <text
                  x={node.x + 14}
                  y={node.y + Math.min(20, node.height / 2 + 1)}
                  fill="#1C1917"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {node.label}
                </text>
                {node.height > 38 && (
                  <text
                    x={node.x + 14}
                    y={node.y + Math.min(35, node.height - 8)}
                    fill={node.color}
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {node.count} <tspan fill="#78716C" fontSize="10">({node.percent}%)</tspan>
                  </text>
                )}
              </g>
            );
          })}

          {/* Column Header Titles */}
          <text x={colX.total} y={14} fill="#78716C" fontSize="10" fontWeight="bold" letterSpacing="0.05em">
            INTAKE VOLUME
          </text>
          <text x={colX.categories} y={14} fill="#78716C" fontSize="10" fontWeight="bold" letterSpacing="0.05em">
            SERVICE CATEGORY
          </text>
          <text x={colX.outcomes} y={14} fill="#78716C" fontSize="10" fontWeight="bold" letterSpacing="0.05em">
            BOOKING OUTCOME
          </text>
        </svg>
      </div>

      {/* Interactive Tooltip Status Pill */}
      <div className="pt-2 border-t border-stone-150 flex items-center justify-between text-xs min-h-[32px]">
        {hoveredRibbon ? (
          <div className="flex items-center gap-2 text-stone-700 animate-in fade-in">
            <span className="font-semibold text-stone-900">{hoveredRibbon.source}</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-stone-900">{hoveredRibbon.target}</span>
            <span className="bg-stone-100 text-stone-900 font-bold px-2 py-0.5 rounded-md">
              {hoveredRibbon.count} bookings ({hoveredRibbon.percentOfTotal || hoveredRibbon.percent}% of total)
            </span>
          </div>
        ) : hoveredNode ? (
          <div className="flex items-center gap-2 text-stone-700 animate-in fade-in">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredNode.color }} />
            <span className="font-bold text-stone-900">{hoveredNode.label}:</span>
            <span>
              {hoveredNode.count} bookings ({hoveredNode.percent}% of total dataset)
            </span>
          </div>
        ) : (
          <div className="text-stone-400 text-[11px] italic">
            Hover over any ribbon or node to view detailed flow conversion metrics.
          </div>
        )}

        <div className="text-[11px] text-stone-500 font-medium hidden sm:block">
          Total Reconciled: <strong className="text-stone-800">{totalCount} Bookings</strong>
        </div>
      </div>
    </div>
  );
}
