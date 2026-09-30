function drawDonut(data) {
	const width = 420;
	const height = 420;
	const radius = Math.min(width, height) / 2 - 16;

	const energyByTechnology = Array.from(
		d3.rollup(
			data,
			rows => d3.sum(rows, row => row.energy_consumpt * row.count),
			row => row.screen_tech
		),
		([screenTech, totalEnergy]) => ({ screenTech, totalEnergy })
	);
	const totalEnergy = d3.sum(energyByTechnology, row => row.totalEnergy);
	const pie = d3.pie()
		.sort(null)
		.value(row => row.totalEnergy);
	const arc = d3.arc()
		.innerRadius(radius * 0.52)
		.outerRadius(radius * 0.88);

	const svg = d3.select("#donut")
		.append("svg")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("role", "img")
		.attr("aria-label", "Donut chart showing each screen technology's share of total TV energy use");
	const chart = svg.append("g")
		.attr("transform", `translate(${width / 2},${height / 2})`);

	const slices = pie(energyByTechnology);
	chart.selectAll(".slice")
		.data(slices)
		.join("path")
		.attr("class", "slice")
		.attr("d", arc)
		.attr("fill", slice => techColour(slice.data.screenTech));

	chart.selectAll(".donut-label")
		.data(slices)
		.join("text")
		.attr("class", "donut-label")
		.attr("transform", slice => `translate(${arc.centroid(slice)})`)
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.text(slice => d3.format(".1%")((slice.data.totalEnergy / totalEnergy)));

	const centerLabel = chart.append("text")
		.attr("class", "donut-center-label")
		.attr("text-anchor", "middle");
	centerLabel.append("tspan")
		.attr("x", 0)
		.attr("dy", "-0.25em")
		.text("Share of");
	centerLabel.append("tspan")
		.attr("x", 0)
		.attr("dy", "1.3em")
		.text("total energy");

	addLegend("#donut");
}

d3.csv("data/Ex5_TV_energy.csv", row => ({
	screen_tech: cleanTech(row.screen_tech),
	energy_consumpt: +row.energy_consumpt,
	count: +row.count
})).then(data => {
	drawDonut(data);
});
