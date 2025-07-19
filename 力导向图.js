<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>哈利波特人物关系可视化</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    /* 基础样式 */
    body {
      margin: 0;
      padding: 20px;
      background-color: #1a1a1a; /* 深色背景，贴合魔法主题 */
      color: #f0f0f0;
      font-family: "Garamond", "Times New Roman", serif; /* 古典字体 */
    }

    /* 三行式标题（抖音图文混排风格） */
    .title-container {
      text-align: center;
      margin: 30px 0 50px;
    }
    .title-line1 {
      font-size: 42px;
      font-weight: bold;
      color: #e63946; /* 格兰芬多红色 */
      letter-spacing: 2px;
    }
    .title-line2 {
      font-size: 24px;
      color: #f1faee;
      margin: 10px 0;
    }
    .title-line3 {
      font-size: 18px;
      color: #a8dadc;
      font-style: italic;
    }

    /* 图表容器布局 */
    .charts-container {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin: 50px 0;
      gap: 30px;
      flex-wrap: wrap;
    }
    .force-container {
      width: 600px;
      height: 600px;
      border: 2px solid #457b9d;
      border-radius: 10px;
      background-color: #0d1b2a;
      position: relative;
    }
    .pie-container {
      width: 400px;
      height: 400px;
      border: 2px solid #457b9d;
      border-radius: 10px;
      background-color: #0d1b2a;
      position: relative;
    }

    /* 力导向图样式 */
    .node {
      cursor: pointer;
    }
    .node circle {
      stroke: #fff;
      stroke-width: 2px;
      transition: all 0.3s;
    }
    .node text {
      font-size: 12px;
      fill: #f1faee;
      text-anchor: middle;
    }
    .link {
      stroke-opacity: 0.6;
      transition: all 0.3s;
    }
    .link:hover {
      stroke-opacity: 1;
    }
    .tooltip {
      position: absolute;
      padding: 10px;
      background: rgba(13, 27, 42, 0.9);
      border: 1px solid #457b9d;
      border-radius: 5px;
      color: #f1faee;
      font-size: 12px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
      max-width: 200px;
    }

    /* 饼图样式与交互 */
    .pie-title {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      color: #f1faee;
      font-size: 18px;
      font-weight: bold;
    }
    .pie-slice {
      transition: all 0.3s;
      cursor: pointer;
    }
    .pie-slice:hover {
      transform: scale(1.05);
    }
    .pie-label {
      font-size: 12px;
      fill: #fff;
      text-anchor: middle;
    }

    /* 签名档与整体配色（哈利波特主题：红金/绿银/蓝铜） */
    .signature {
      margin: 40px auto;
      text-align: center;
      padding: 20px;
      border-top: 1px dashed #457b9d;
      max-width: 800px;
    }
    .signature-title {
      font-size: 16px;
      color: #e63946; /* 格兰芬多红 */
      margin-bottom: 5px;
    }
    .signature-content {
      font-size: 14px;
      color: #a8dadc;
      line-height: 1.5;
    }

    /* 三行式标题（抖音风格） */
    .douyin-title {
      font-family: "Arial Black", sans-serif;
      text-align: center;
      margin: 20px 0;
    }
    .douyin-line1 {
      font-size: 28px;
      color: #e63946; /* 主色：红金 */
      text-shadow: 0 0 5px #ffd700;
    }
    .douyin-line2 {
      font-size: 18px;
      color: #ffd700;
      margin: 5px 0;
    }
    .douyin-line3 {
      font-size: 14px;
      color: #a8dadc;
      font-style: italic;
    }
  </style>
</head>
<body>
  <!-- 抖音风格三行式标题 -->
  <div class="douyin-title">
    <div class="douyin-line1">哈利波特人物关系图谱</div>
    <div class="douyin-line2">正邪交锋·友谊与背叛</div>
    <div class="douyin-line3">揭秘魔法世界的核心羁绊</div>
  </div>

  <div class="charts-container">
    <!-- 力导向图容器 -->
    <div class="force-container" id="force-chart">
      <div class="tooltip" id="force-tooltip"></div>
    </div>

    <!-- 饼图容器（学院分布） -->
    <div class="pie-container" id="pie-chart">
      <div class="pie-title">霍格沃茨学院人物分布</div>
      <div class="tooltip" id="pie-tooltip"></div>
    </div>
  </div>

  <!-- 签名档 -->
  <div class="signature">
    <div class="signature-title">哈利波特魔法世界人物关系可视化</div>
    <div class="signature-content">
      数据来源：《哈利波特》系列原著 | 力导向图展示核心人物羁绊 | 
      配色参考霍格沃茨四大学院 | 22计传张颖惠 制作
    </div>
  </div>

  <script>
    // 加载人物关系数据
    d3.json("哈利波特relations.json").then(data => {
      // 1. 力导向图实现
      const forceWidth = 600;
      const forceHeight = 600;

      // 创建SVG
      const forceSvg = d3.select("#force-chart")
        .append("svg")
        .attr("width", forceWidth)
        .attr("height", forceHeight);

      // 定义学院配色（与主题一致）
      const houseColor = {
        "格兰芬多": "#e63946", // 红
        "斯莱特林": "#2a9d8f", // 绿
        "拉文克劳": "#1d3557", // 蓝
        "赫奇帕奇": "#e9c46a"  // 黄
      };

      // 力导向模拟
      const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id).distance(d => 200 - d.value * 10))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(forceWidth / 2, forceHeight / 2))
        .force("collide", d3.forceCollide().radius(d => 30));

      // 绘制连接线
      const link = forceSvg.append("g")
        .selectAll("line")
        .data(data.links)
        .enter().append("line")
        .attr("class", "link")
        .attr("stroke", "#457b9d")
        .attr("stroke-width", d => d.value / 2);

      // 绘制节点（尺寸由边的value决定）
      const node = forceSvg.append("g")
        .selectAll(".node")
        .data(data.nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

      // 节点圆圈（尺寸映射边的总权重）
      node.append("circle")
        .attr("r", d => {
          // 计算节点关联的边的总权重，作为尺寸依据
          const totalValue = data.links
            .filter(link => link.source.id === d.id || link.target.id === d.id)
            .reduce((sum, link) => sum + link.value, 0);
          return Math.max(8, totalValue / 3); // 最小8px
        })
        .attr("fill", d => houseColor[d.house]);

      // 节点文字
      node.append("text")
        .attr("dy", d => {
          // 文字位置随节点大小调整
          const totalValue = data.links
            .filter(link => link.source.id === d.id || link.target.id === d.id)
            .reduce((sum, link) => sum + link.value, 0);
          return Math.max(8, totalValue / 3) + 10;
        })
        .text(d => d.name);

      // 节点交互提示
      node.on("mouseover", (event, d) => {
        const relatedLinks = data.links.filter(link => 
          link.source.id === d.id || link.target.id === d.id
        );
        const relations = relatedLinks.map(link => {
          const other = link.source.id === d.id ? link.target : link.source;
          return `${other.name}: ${link.relation}`;
        }).join("<br>");

        d3.select("#force-tooltip")
          .html(`<strong>${d.name}</strong><br>${d.house}<br><br>关系:<br>${relations}`)
          .style("opacity", 1)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 20) + "px");
      }).on("mouseout", () => {
        d3.select("#force-tooltip").style("opacity", 0);
      });

      // 力导向图更新
      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node.attr("transform", d => `translate(${d.x},${d.y})`);
      });

      // 拖拽功能
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

      // 2. 饼图实现（学院人物分布）
      const pieWidth = 400;
      const pieHeight = 400;
      const radius = Math.min(pieWidth, pieHeight) / 3;

      // 统计各学院人数
      const houseCount = {};
      data.nodes.forEach(node => {
        houseCount[node.house] = (houseCount[node.house] || 0) + 1;
      });
      const pieData = Object.entries(houseCount).map(([house, count]) => ({
        house, count
      }));

      // 创建SVG
      const pieSvg = d3.select("#pie-chart")
        .append("svg")
        .attr("width", pieWidth)
        .attr("height", pieHeight)
        .append("g")
        .attr("transform", `translate(${pieWidth / 2}, ${pieHeight / 2})`);

      // 饼图布局
      const pie = d3.pie()
        .value(d => d.count);
      const arcs = pie(pieData);

      // 弧形生成器
      const arc = d3.arc()
        .innerRadius(radius * 0.4) // 环形图
        .outerRadius(radius);

      // 标签位置
      const labelArc = d3.arc()
        .innerRadius(radius * 1.1)
        .outerRadius(radius * 1.1);

      // 绘制扇形
      const slices = pieSvg.selectAll(".pie-slice")
        .data(arcs)
        .enter().append("path")
        .attr("class", "pie-slice")
        .attr("d", arc)
        .attr("fill", d => houseColor[d.data.house])
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);

      // 饼图交互（鼠标悬停）
      slices.on("mouseover", (event, d) => {
        // 高亮当前扇形
        slices.attr("opacity", s => s === d ? 1 : 0.5);
        
        // 显示学院详情
        const house = d.data.house;
        const members = data.nodes
          .filter(node => node.house === house)
          .map(node => node.name)
          .join("、");
        
        d3.select("#pie-tooltip")
          .html(`<strong>${house}</strong><br>人数: ${d.data.count}<br>成员: ${members}`)
          .style("opacity", 1)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 20) + "px");
      }).on("mouseout", () => {
        // 恢复所有扇形
        slices.attr("opacity", 1);
        d3.select("#pie-tooltip").style("opacity", 0);
      });

      // 学院标签
      pieSvg.selectAll(".pie-label")
        .data(arcs)
        .enter().append("text")
        .attr("class", "pie-label")
        .attr("transform", d => `translate(${labelArc.centroid(d)})`)
        .text(d => `${d.data.house} (${d.data.count})`);

      // 中心文本
      pieSvg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.3em")
        .attr("fill", "#f1faee")
        .attr("font-size", 14)
        .text("学院分布");
    });
  </script>
</body>
</html>
