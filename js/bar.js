function drawBar(data) {
	const margin = { top: 36, right: 24, bottom: 72, left: 88 };
	const width = 720;
	const height = 420;
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	const x = d3.scaleBand()
		.domain(data.map(row => row.screenTech))
		.range([0, innerWidth])
		.padding(0.28);
	const y = d3.scaleLinear()
		.domain([0, d3.max(data, row => row.meanEnergy)])
		.nice()
		.range([innerHeight, 0]);

	const svg = d3.select("#bar")
		.append("svg")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("role", "img")
		.attr("aria-label", "Bar chart of average annual energy use by screen technology");
	const plot = svg.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	const grid = plot.append("g")
		.attr("class", "grid")
		.call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(""));
	grid.select(".domain").remove();
	grid.selectAll(".tick line").attr("stroke", "#e5ece8");

	plot.append("g")
		.attr("transform", `translate(0,${innerHeight})`)
		.call(d3.axisBottom(x).tickSizeOuter(0));
	plot.append("g")
		.call(d3.axisLeft(y).tickSizeOuter(0));

	plot.selectAll(".bar")
		.data(data)
		.join("rect")
		.attr("class", "bar")
		.attr("x", row => x(row.screenTech))
		.attr("y", row => y(row.meanEnergy))
		.attr("width", x.bandwidth())
		.attr("height", row => y(0) - y(row.meanEnergy))
		.attr("fill", row => techColour(row.screenTech));

	plot.selectAll(".bar-value")
		.data(data)
		.join("text")
		.attr("class", "bar-value")
		.attr("x", row => x(row.screenTech) + x.bandwidth() / 2)
		.attr("y", row => y(row.meanEnergy) - 9)
		.attr("text-anchor", "middle")
		.text(row => `${Math.round(row.meanEnergy)}`);

	plot.append("text")
		.attr("class", "axis-label")
		.attr("x", innerWidth / 2)
		.attr("y", innerHeight + 54)
		.attr("text-anchor", "middle")
		.text("Screen technology");
	plot.append("text")
		.attr("class", "axis-label")
		.attr("transform", "rotate(-90)")
		.attr("x", -innerHeight / 2)
		.attr("y", -62)
		.attr("text-anchor", "middle")
		.text("Average energy use (kWh/year)");
}

d3.csv("data/Ex5_TV_energy_55inchtv_byScreenType.csv", row => ({
	screenTech: row["Screen_Tech"],
	meanEnergy: +row["Mean(Labelled energy consumption (kWh/year))"]
})).then(data => {
	drawBar(data);
});
