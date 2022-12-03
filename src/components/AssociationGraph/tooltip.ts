import G6 from "@antv/g6";

export const tooltip = new G6.Tooltip({
    offsetX: 10,
    offsetY: 20,
    getContent(e) {
      const outDiv = document.createElement('div');
      outDiv.style.width = '180px';
      outDiv.innerHTML = `
        <ul>
          <li>标记: ${e?.item?.getModel().name}</li>
          <li>地址: ${e?.item?.getModel().address ?? "未知"}</li>
        </ul>`
      return outDiv
    },
    itemTypes: ['node']
  });
  