function createOverviewChart() {
    const data = {
        totalRevenue: 83738,
        growthRate: 7.8
    };

    const svg = d3.select("#overview-chart")
        .append("svg")
        .attr("width", 400)
        .attr("height", 400);

    const arc = d3.arc()
        .innerRadius(150)
        .outerRadius(180)
        .startAngle(0);

    const pie = d3.pie()
        .value(d => d.value);

    const arcs = svg.selectAll(".arc")
        .data(pie([
            {name: "文化产业收入", value: data.totalRevenue},
            {name: "其他", value: 100000 - data.totalRevenue}
        ]))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(200,200)");

    const morandiColors = ["#B1A394", "#D5C0A1"];

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => morandiColors[i]);

    svg.append("text")
        .attr("x", 200)
        .attr("y", 200)
        .attr("text-anchor", "middle")
        .text(`${data.totalRevenue}亿元`)
        .style("font-size", "20px");
}

createOverviewChart();
