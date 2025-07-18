function createRadarChart() {
    const data = [
        {axis: "文化制造业", value: 49609},
        {axis: "文化批发和零售业", value: 32679},
        {axis: "文化服务业", value: 109134}
    ];

    const radarChartOptions = {
        w: 300,
        h: 300,
        maxValue: 120000,
        levels: 5,
        roundStrokes: true
    };

    const svg = d3.select("#radar-chart")
        .append("svg")
        .attr("width", radarChartOptions.w)
        .attr("height", radarChartOptions.h);

    // 雷达图实现逻辑（此处简化）
    // 使用莫兰迪色系进行颜色渲染
}

function createRingChart() {
    const data = [
        {name: "文化制造业", value: 49609},
        {name: "文化批发和零售业", value: 32679},
        {name: "文化服务业", value: 109134}
    ];

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc()
        .innerRadius(100)
        .outerRadius(150);

    const svg = d3.select("#ring-chart")
        .append("svg")
        .attr("width", 300)
        .attr("height", 300);

    const morandiColors = ["#B1A394", "#D5C0A1", "#A6A69F"];

    svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => morandiColors[i]);
}

createRadarChart();
createRingChart();
