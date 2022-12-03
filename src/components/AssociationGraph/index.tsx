import React, { useEffect, useRef } from "react";
import data from "./data";
import G6, { Graph, IG6GraphEvent } from "@antv/g6";
import { legend } from "./legend";
import { tooltip } from "./tooltip";

const minimap = new G6.Minimap({
    size: [200, 200],
    className: 'minimap',
    type: 'delegate',
  });

export default function AssociationGraph() {
  const ref = React.useRef<HTMLDivElement>(null);
  const graph = useRef<Graph | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!graph.current && container) {
      const height = container.scrollHeight - 150;
      const width = container.scrollWidth;


      const timebar = new G6.TimeBar({
        x: 0,
        y: 0,
        width,
        height: 150,
        padding: 10,
        type: 'simple',
        trend: {
          data: data.dates,
        },
      });

      graph.current = new G6.Graph({
        container,
        width,
        height,
        fitView: true,
        fitViewPadding: 50,
        defaultEdge: {
          size: 2,
          style: {
            endArrow: {
              path: 'M 0,0 L 8,4 L 8,-4 Z',
              fill: '#e2e2e2',
            },
          },
        },
        layout: {
          type: "force", // 指定为力导向布局
          preventOverlap: true, // 防止节点重叠
          nodeSpacing: 100,
          linkDistance: 100, // 设置边长为 100

        },
        modes: {
          default: ["drag-canvas", 'zoom-canvas', "drag-node", 'activate-relations'],
        },
        nodeStateStyles: {
          activeByLegend: {
            lineWidth: 10,
            strokeOpacity: 0.5,
          },
          inactiveByLegend: {
            opacity: 0.5
          },
        },
        edgeStateStyles: {
          activeByLegend: {
            lineWidth: 3,
          },
          inactiveByLegend: {
            opacity: 0.5,
          },
        },
        plugins: [legend, tooltip, minimap, timebar],
      });

      if (graph.current) {
        const antGraph = graph.current;
        antGraph.data({
          nodes: data.nodes,
          edges: data.edges.map(function (edge, i) {
            edge.id = "edge" + i;
            return Object.assign({}, edge);
          })
        });
        antGraph.render();

        antGraph.on("node:dragstart", function (e) {
          antGraph.layout();
          refreshDragedNodePosition(e);
        });
        antGraph.on("node:drag", function (e) {
          refreshDragedNodePosition(e);
        });
        antGraph.on("node:dragend", function (e) {
          if (e.item) {
            e.item.get("model").fx = null;
            e.item.get("model").fy = null;
          }
        });

        if (typeof window !== "undefined")
          window.onresize = () => {
            if (!antGraph || antGraph.get("destroyed")) return;
            if (!container || !container.scrollWidth || !container.scrollHeight)
              return;
            antGraph.changeSize(container.scrollWidth, container.scrollHeight - 150);
          };
      }
    }
  }, []);

  return <div ref={ref} className="h-full"></div>;
}

function refreshDragedNodePosition(e: IG6GraphEvent) {
  if (e.item) {
    const model = e.item.get("model");
    model.fx = e.x;
    model.fy = e.y;
  }
}
