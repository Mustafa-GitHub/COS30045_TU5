function drawLine(data) {
	const margin = { top: 24, right: 112, bottom: 68, left: 82 };
	const width = 720;
	const height = 420;
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	const x = d3.scaleLinear()
		.domain(d3.extent(data, row => row.year))
		.nice()
		.range([0, innerWidth]);
	const y = d3.scaleLinear()
		.domain([0, d3.max(data, row => row.average ?? 0)])
		.nice()
		.range([innerHeight, 0]);
	const line = d3.line()
		.defined(row => row.average !== null && Number.isFinite(row.average))
		.x(row => x(row.year))
		.y(row => y(row.average));

	const validAverageRows = data.filter(row => Number.isFinite(row.average));
	const lastPoint = validAverageRows[validAverageRows.length - 1];
	const svg = d3.select("#line")
		.append("svg")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("role", "img")
		.attr("aria-label", "Line chart of average electricity spot price from 1998 to 2024");
	const plot = svg.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	const grid = plot.append("g")
		.attr("class", "grid")
		.call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(""));
	grid.select(".domain").remove();
	grid.selectAll(".tick line").attr("stroke", "#e5ece8");

	plot.append("g")
		.attr("transform", `translate(0,${innerHeight})`)
		.call(d3.axisBottom(x).ticks(7).tickFormat(d3.format("d")));
	plot.append("g")
		.call(d3.axisLeft(y).tickSizeOuter(0));

	plot.append("path")
		.datum(data)
		.attr("class", "average-line")
		.attr("d", line);
	plot.selectAll(".average-point")
		.data(validAverageRows)
		.join("circle")
		.attr("class", "average-point")
		.attr("cx", row => x(row.year))
		.attr("cy", row => y(row.average))
		.attr("r", 3);

	plot.append("text")
		.attr("class", "line-end-label")
		.attr("x", x(lastPoint.year) + 8)
		.attr("y", y(lastPoint.average))
		.attr("dy", "0.35em")
		.text("Average price");

	plot.append("text")
		.attr("class", "axis-label")
		.attr("x", innerWidth / 2)
		.attr("y", innerHeight + 52)
		.attr("text-anchor", "middle")
		.text("Year");
	plot.append("text")
		.attr("class", "axis-label")
		.attr("transform", "rotate(-90)")
		.attr("x", -innerHeight / 2)
		.attr("y", -62)
		.attr("text-anchor", "middle")
		.text("Spot price ($ per MWh)");
}

d3.csv("data/Ex5_ARE_Spot_Prices.csv", row => ({
	year: +row.Year,
	qld: row["Queensland ($ per megawatt hour)"] === "" ? null : +row["Queensland ($ per megawatt hour)"],
	nsw: row["New South Wales ($ per megawatt hour)"] === "" ? null : +row["New South Wales ($ per megawatt hour)"],
	vic: row["Victoria ($ per megawatt hour)"] === "" ? null : +row["Victoria ($ per megawatt hour)"],
	sa: row["South Australia ($ per megawatt hour)"] === "" ? null : +row["South Australia ($ per megawatt hour)"],
	tas: row["Tasmania ($ per megawatt hour)"] === "" ? null : +row["Tasmania ($ per megawatt hour)"],
	snowy: row["Snowy ($ per megawatt hour)"] === "" ? null : +row["Snowy ($ per megawatt hour)"],
	average: row["Average Price (notTas-Snowy)"] === "" ? null : +row["Average Price (notTas-Snowy)"]
})).then(data => {
	drawLine(data);
});
