import G6, { GraphData } from "@antv/g6";
import { Category, colors, strokes } from "./data";

enum LegendType {
    SOURCE = "source",
    EXPOSE = "expose",
    TOUCH = "touch",
    FOREIGN = "foreign",
    SCREENING = "screening",
    LINK = "link"
}

const legendData: GraphData = {
    nodes: [{
        id: LegendType.SOURCE,
        label: "确诊病例",
        type: 'circle',
        size: 20,
        style: {
            fill: colors[Category.SOURCE],
            stroke: strokes[Category.SOURCE]
        }
    }, {
        id: LegendType.EXPOSE,
        label: "涉疫场所暴露人员",
        type: 'circle',
        size: 20,
        style: {
            fill: colors[Category.EXPOSE],
            stroke: strokes[Category.EXPOSE]
        }
    }, {
        id: LegendType.TOUCH,
        label: "密接",
        type: 'circle',
        size: 20,
        style: {
            fill: colors[Category.TOUCH],
            stroke: strokes[Category.TOUCH]
        }
    }, {
        id: LegendType.FOREIGN,
        label: "省外来杭",
        type: 'circle',
        size: 20,
        style: {
            fill: colors[Category.FOREIGN],
            stroke: strokes[Category.FOREIGN]
        }
    }, {
        id: LegendType.SCREENING,
        label: "筛查发现",
        type: 'circle',
        size: 20,
        style: {
            fill: colors[Category.SCREENING],
            stroke: strokes[Category.SCREENING]
        }
    }],
    edges: [{
        id: LegendType.LINK,
        label: "感染关联",
        type: 'line',
        style: {
            width: 20,
            stroke: '#737373',
        }
    }]
}


export const legend = new G6.Legend({
    data: legendData,
    align: 'center',
    layout: 'vertical', // vertical
    position: 'bottom-right',
    vertiSep: 12,
    horiSep: 24,
    offsetY: -24,
    padding: [20, 16, 20, 16],
    containerStyle: {
        fill: '#fff',
        lineWidth: 2,
        stroke: '#cbd5e1'
    },
    titleConfig: {
        position: 'center',
        offsetX: 0,
        offsetY: 0,
        fontSize: 12,
    },
    filter: {
        enable: true,
        multiple: true,
        trigger: 'click',
        graphActiveState: 'activeByLegend',
        graphInactiveState: 'inactiveByLegend',
        filterFunctions: {
            [LegendType.SOURCE]: (d) => {
                if (d.legendType === Category.SOURCE) return true;
                return false
            },
            [LegendType.EXPOSE]: (d) => {
                if (d.legendType === Category.EXPOSE) return true;
                return false
            },
            [LegendType.FOREIGN]: (d) => {
                if (d.legendType === Category.FOREIGN) return true;
                return false
            },
            [LegendType.TOUCH]: (d) => {
                if (d.legendType === Category.TOUCH) return true;
                return false
            },
            [LegendType.SCREENING]: (d) => {
                if (d.legendType === Category.SCREENING) return true;
                return false
            },
            [LegendType.LINK]: (d) => {
                return true;
            }
        }
    }
});