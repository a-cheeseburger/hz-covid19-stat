import { ComboConfig, EdgeConfig, NodeConfig } from "@antv/g6";
import data from "../../../data/source.json";

export enum Category {
    SOURCE,
    EXPOSE,
    TOUCH,
    FOREIGN,
    SCREENING
};


type DataType = {
    type: Category,
    address?: string,
    source?: string
};



const graphData: {
    nodes: NodeConfig[],
    edges: EdgeConfig[],
    dates: {
        date: string;
        value: string;
    }[],
} = {
    nodes: [],
    edges: [],
    dates: [],
   
};


export const colors = [
    '#ef4444',
    '#f97316',
    '#86efac',
    '#14b8a6',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
];
export const strokes = [
    '#f87171',
    '#fb923c',
    '#bbf7d0',
    '#2dd4bf',
    '#60a5fa',
    '#a78bfa',
    '#f472b6'
];

const dates: string[] = [];
for (const id in data) {
    const item = (data[id as keyof typeof data] as DataType);
    const [month, date, serial] = id.split("-");
    dates.push(`${month}${date}`);
    graphData.nodes.push({
        id,
        size: item.type === Category.SOURCE ? 50 : Category.TOUCH ? 30 : 15,
        style: {
            fill: colors[item.type],
            stroke: strokes[item.type],
            lineWidth: 2,
        },
        date: `${month}${date}`,
        legendType: item.type,
        name:
            item.type === Category.SOURCE
                ? `${month}-${date} ${serial}号确诊`
                : `${month}-${date}-${serial}号感染者`,
        address: item.address,
    });
    if (item.source) {
        graphData.edges.push({
            source: item.source,
            target: id
        });
    }
}

graphData.nodes = filterSourceAndLink(graphData.nodes, graphData.edges);
graphData.dates = countBy(dates);


function filterSourceAndLink(nodes: NodeConfig[], edges: EdgeConfig[]) {
    const nodeSourceSet = new Set();
    const nodeTargetSet = new Set();
    edges.forEach((e) => {
        nodeTargetSet.add(e.target);
        nodeSourceSet.add(e.source);
    })
    const filteredNodes = nodes.filter(n => n.legendType === Category.SOURCE || nodeTargetSet.has(n.id) || nodeSourceSet.has(n.id))

    filteredNodes.forEach(n => {
        if (nodeSourceSet.has(n.id) && !nodeTargetSet.has(n.id)) {
            n.size = 80;
            n.label = n.address ?? "未知";
        }
    })

    return filteredNodes;
}

function countBy(array: string[]) {
    const count: Record<string, number> = {}

    for (let i = 0; i < array.length; i++) {
        count[array[i]] = (count[array[i]] || 0) + 1
    }

    return Object.keys(count).map(date => ({
        date,
        value: `${count[date]}`
    }))
}

export default graphData;

