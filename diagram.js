class Diagram {
    constructor(containerId) {
        // 设置图表尺寸和边距
        this.margin = {top: 20, right: 20, bottom: 30, left: 40};
        this.width = 400 - this.margin.left - this.margin.right;
        this.height = 200 - this.margin.top - this.margin.bottom;
        this.data = [];

        // 创建SVG容器
        this.svg = d3.select("#" + containerId)
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .style("position", "absolute")
            .style("top", "10px")
            .style("left", "10px")
            .append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

        // 创建比例尺
        this.x = d3.scaleLinear().range([0, this.width]);
        // 修改y轴比例尺为固定范围
        this.y = d3.scaleLinear()
            .domain([-0.2, 0.2])
            .range([this.height, 0]);

        // 创建轴
        this.xAxis = this.svg.append("g")
            .attr("transform", `translate(0,${this.height})`);
        this.yAxis = this.svg.append("g");

        // 创建折线生成器
        this.line = d3.line()
            .x(d => this.x(d.time))
            .y(d => this.y(d.angle));

        // 添加路径元素
        this.path = this.svg.append("path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5);

        // 添加y=0的水平参考线
        this.svg.append("line")
        .attr("x1", 0)
        .attr("x2", this.width)
        .attr("y1", this.y(0))
        .attr("y2", this.y(0))
        .attr("stroke", "gray")
        .attr("stroke-dasharray", "4")
        .attr("stroke-width", 1);

    }

    update(time, angle) {
        this.data.push({time, angle});
        if (this.data.length > 50) {
            this.data.shift();
        }


        // 只更新x轴比例尺范围
        this.x.domain([d3.min(this.data, d => d.time), d3.max(this.data, d => d.time)]);

        // 更新轴和路径
        this.xAxis.call(d3.axisBottom(this.x));
        this.yAxis.call(d3.axisLeft(this.y));
        this.path.datum(this.data).attr("d", this.line);
    }
}