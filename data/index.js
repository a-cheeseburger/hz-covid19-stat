const {rawData} = require("./raw");
const fs = require("fs");
const path = require("path");

const data = [];

// enum Category {
//     SOURCE,
//     EXPOSE,
//     TOUCH,
//     FOREIGN,
//     SCREENING
// };

Object.entries(rawData).forEach(([date, content]) => {
    const items = content.split(/\n/).filter(item => !!item.trim());

    items.forEach(item => {
        const isTypeSource = item.includes("确诊") && !item.includes("密接");
        const [itemId, details] = item.split("：");

        if (itemId && details && /\d+/.test(itemId)) {
            const idMatch = itemId.match(/(\d+)(?:-(\d+))?/);
            const idStart = +idMatch?.[1];
            const idEnd = idMatch?.[2] ?? idStart;
            const ids = new Array(idEnd - idStart + 1).fill(1).map((_v, i) => `${date}-`+ `${(idStart + i)}`.padStart(2, "0") + (isTypeSource ? "x" : ""));
            const address = details.match(/现住址为([^，,。$]+)/)?.[1];

            if (isTypeSource) {
                data.push(...ids.map(id => [id, {
                    type: 0,
                    address
                }]));
            }
            
            const isTypeTouch = details.includes("密接");
            if (isTypeTouch) {
                const sourceMatch = details.match(/(\d+)月(\d+)日(?:[^\d]+)(\d+)的密接/);
                const isSourceTypeTouch = details.includes("无症状感染者");
                if (sourceMatch && sourceMatch[1] && sourceMatch[2] && sourceMatch[3]) {
                    const source = [sourceMatch[1].padStart(2, "0"), sourceMatch[2].padStart(2, "0"), sourceMatch[3].padStart(2, "0") + (isSourceTypeTouch ? "" : "x")].join("-");

                    data.push(...ids.map(id => [id, {
                        type: 2,
                        address,
                        source
                    }]));
                }
            } else {
                const type = details.includes("涉疫场所") ? 1 : details.includes("省外来杭") ? 3 : 4;

                data.push(...ids.map(id => [id, {
                    type,
                    address
                }]));
            }
        } else {
            console.error("Format Error");
        }
    })
});

fs.writeFileSync(path.join("data", "source.json"), JSON.stringify(Object.fromEntries(data)));