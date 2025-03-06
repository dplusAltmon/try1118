// 获取SVG元素
const svg = document.getElementById('histogram');

// 数据
const data = [120, 250, 180, 300, 220, 150];
const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

// 计算直方图的宽度和高度
const width = svg.getAttribute('width');
const height = svg.getAttribute('height');
const barWidth = width / data.length;
const barPadding = 5;

// 绘制直方图
data.forEach((value, index) => {
    const bar = document.createElementNS('http://www.w3.org/2000/svg','rect');
    bar.setAttributeNS(null, 'x', index * barWidth + barPadding);
    bar.setAttributeNS(null, 'y', height - value);
    bar.setAttributeNS(null, 'width', barWidth - 2 * barPadding);
    bar.setAttributeNS(null, 'height', value);
    bar.setAttributeNS(null,'style', 'fill:skyblue;stroke:black;stroke-width:1');
    svg.appendChild(bar);

    // 添加数值文字
    const textValue = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textValue.setAttributeNS(null, 'x', index * barWidth + barWidth / 2);
    textValue.setAttributeNS(null, 'y', height - value - 5);
    textValue.setAttributeNS(null, 'text-anchor','middle');
    textValue.setAttributeNS(null, 'fill', 'black');
    textValue.textContent = value;
    svg.appendChild(textValue);

    // 添加类别文字
    const textLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textLabel.setAttributeNS(null, 'x', index * barWidth + barWidth / 2);
    textLabel.setAttributeNS(null, 'y', height - 10);
    textLabel.setAttributeNS(null, 'text-anchor','middle');
    textLabel.setAttributeNS(null, 'fill', 'black');
    textLabel.textContent = labels[index];
    svg.appendChild(textLabel);
});

// 在直方图左上方标注文字
const annotation = document.createElementNS('http://www.w3.org/2000/svg', 'text');
annotation.setAttributeNS(null, 'x', 10);
annotation.setAttributeNS(null, 'y', 20);
annotation.setAttributeNS(null, 'fill', 'black');
annotation.textContent = '22计传张颖惠';
svg.appendChild(annotation);
