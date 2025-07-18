// 力导向图
function createForceChart() {
    const nodes = [
        {name: '文化装备生产', revenue: 7820},
        {name: '内容创作生产', revenue: 38827},
        {name: '文化服务业', revenue: 109134},
        {name: '文化批发和零售业', revenue: 32679}
    ];

    const links = [
        {source: 0, target: 1},
        {source: 1, target: 2},
        {source: 2, target: 3}
    ];

    const svg = d3.select("#force-chart")
        .append("svg")
        .attr("width", 500)
        .attr("height", 500);

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink().id(d => d.index).distance(50))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(250, 250));

    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke", "#B1A394");

    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", d => Math.sqrt(d.revenue) / 10)
        .attr("fill", "#D5C0A1")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("title").text(d => d.name);

    simulation.nodes(nodes).on("tick", () => {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    simulation.force("link").links(links);

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

// 产业领域环形图
function createStructureRingChart() {
    const data = [
        {name: "文化核心领域", value: 270541},
        {name: "文化相关领域", value: 73446}
    ];

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc()
        .innerRadius(100)
        .outerRadius(150);

    const svg = d3.select("#structure-ring-chart")
        .append("svg")
        .attr("width", 300)
        .attr("height", 300);

    const morandiColors = ["#B1A394", "#D5C0A1"];

    svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => morandiColors[i]);
}

// 利润总额折线图
function createProfitLineChart() {
    const data = [
        {year: '2021', profit: 20000},
        {year: '2022', profit: 25000},
        {year: '2023', profit: 30000},
        {year: '2024', profit: 35000}
    ];

    const svg = d3.select("#profit-line-chart")
        .append("svg")
        .attr("width", 400)
        .attr("height", 200);

    const x = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([0, 370])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.profit)])
        .range([180, 0]);

    svg.append("g")
        .attr("transform", "translate(0,180)")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    const line = d3.line()
        .x(d => x(d.year) + x.bandwidth() / 2)
        .y(d => y(d.profit));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#B1A394")
        .attr("stroke-width", 2)
        .attr("d", line);
}

// 研发投入直方图
function createResearchBarChart() {
    const data = [
        {industry: '文化装备生产', investment: 1200},
        {industry: '内容创作生产', investment: 1500},
        {industry: '文化服务业', investment: 1800}
    ];

    const svg = d3.select("#research-bar-chart")
        .append("svg")
        .attr("width", 400)
        .attr("height", 200);

    const x = d3.scaleBand()
        .domain(data.map(d => d.industry))
        .range([0, 370])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.investment)])
        .range([180, 0]);

    svg.append("g")
        .attr("transform", "translate(0,180)")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.industry))
        .attr("y", d => y(d.investment))
        .attr("width", x.bandwidth())
        .attr("height", d => 180 - y(d.investment))
        .attr("fill", "#D5C0A1");
}

// 初始化函数
function initStructureAnalysis() {
    createForceChart();
    createStructureRingChart();
    createProfitLineChart();
    createResearchBarChart();
}

initStructureAnalysis();
