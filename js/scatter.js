function drawScatter(data) {
	const margin = { top: 20, right: 20, bottom: 76, left: 76 };
	const width = 720;
	const height = 420;
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	const x = d3.scaleLinear()
		.domain(d3.extent(data, row => row.star2))
		.nice()
		.range([0, innerWidth]);
	const y = d3.scaleLinear()
		.domain([0, d3.max(data, row => row.energy_consumpt)])
		.nice()
		.range([innerHeight, 0]);

	const svg = d3.select("#scatter")
		.append("svg")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("role", "img")
		.attr("aria-label", "Scatter plot of TV star rating and annual energy use");
	const plot = svg.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	const grid = plot.append("g")
		.attr("class", "grid")
		.call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(""));
	grid.select(".domain").remove();
	grid.selectAll(".tick line").attr("stroke", "#e5ece8");

	plot.append("g")
		.attr("transform", `translate(0,${innerHeight})`)
		.call(d3.axisBottom(x));
	plot.append("g")
		.call(d3.axisLeft(y));

	plot.selectAll(".point")
		.data(data)
		.join("circle")
		.attr("class", "point")
		.attr("cx", row => x(row.star2))
		.attr("cy", row => y(row.energy_consumpt))
		.attr("r", 3.5)
		.attr("fill", row => techColour(row.screen_tech))
		.attr("fill-opacity", 0.6);

	plot.append("text")
		.attr("class", "axis-label")
		.attr("x", innerWidth / 2)
		.attr("y", innerHeight + 58)
		.attr("text-anchor", "middle")
		.text("Star rating (more stars = more efficient)");
	plot.append("text")
		.attr("class", "axis-label")
		.attr("transform", "rotate(-90)")
		.attr("x", -innerHeight / 2)
		.attr("y", -56)
		.attr("text-anchor", "middle")
		.text("Energy use (kWh/year)");

	addLegend("#scatter");
}

d3.csv("data/Ex5_TV_energy.csv", row => ({
	brand: row.brand,
	screen_tech: cleanTech(row.screen_tech),
	screensize: +row.screensize,
	energy_consumpt: +row.energy_consumpt,
	star2: +row.star2,
	count: +row.count
})).then(data => {
	console.log(data);
	drawScatter(data);
});
