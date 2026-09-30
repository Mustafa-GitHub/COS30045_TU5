function drawLine(data) {
	const margin = { top: 24, right: 112, bottom: 68, left: 82 };
	const width = 720;
	const height = 420;
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;
	const series = [
		{ key: "qld", label: "QLD", color: "#718992" },
		{ key: "nsw", label: "NSW", color: "#a8795d" },
		{ key: "vic", label: "VIC", color: "#718b79" },
		{ key: "sa", label: "SA", color: "#927f9a" },
		{ key: "tas", label: "TAS", color: "#a28f55" },
		{ key: "average", label: "Average", color: "#18302d" }
	];

	const x = d3.scaleLinear()
		.domain(d3.extent(data, row => row.year))
		.nice()
		.range([0, innerWidth]);
	const y = d3.scaleLinear()
		.domain([0, d3.max(data, row => d3.max(series, item => row[item.key] ?? 0))])
		.nice()
		.range([innerHeight, 0]);
	const lineFor = item => d3.line()
		.defined(row => Number.isFinite(row[item.key]))
		.x(row => x(row.year))
		.y(row => y(row[item.key]));

	const validAverageRows = data.filter(row => Number.isFinite(row.average));
	const endpointLabels = series.map(item => {
		const validRows = data.filter(row => Number.isFinite(row[item.key]));
		const point = validRows[validRows.length - 1];
		return point ? { item, point, pointY: y(point[item.key]) } : null;
	}).filter(Boolean).sort((first, second) => first.pointY - second.pointY);
	const labelGap = 19;
	endpointLabels.forEach((endpoint, index) => {
		endpoint.labelY = index === 0
			? Math.max(8, endpoint.pointY)
			: Math.max(endpoint.pointY, endpointLabels[index - 1].labelY + labelGap);
	});
	const labelOverflow = Math.max(0, endpointLabels[endpointLabels.length - 1].labelY - (innerHeight - 8));
	endpointLabels.forEach(endpoint => {
		endpoint.labelY -= labelOverflow;
	});
	const svg = d3.select("#line")
		.append("svg")
		.attr("viewBox", `0 0 ${width} ${height}`)
		.attr("role", "img")
		.attr("aria-label", "Line chart of average and state electricity spot prices from 1998 to 2024");
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

	plot.selectAll(".state-line")
		.data(series.filter(item => item.key !== "average"))
		.join("path")
		.attr("class", "state-line")
		.attr("stroke", item => item.color)
		.attr("d", item => lineFor(item)(data));
	plot.append("path")
		.datum(data)
		.attr("class", "average-line")
		.attr("d", lineFor(series.find(item => item.key === "average"))(data));
	plot.selectAll(".average-point")
		.data(validAverageRows)
		.join("circle")
		.attr("class", "average-point")
		.attr("cx", row => x(row.year))
		.attr("cy", row => y(row.average))
		.attr("r", 3);

	plot.selectAll(".line-label-leader")
		.data(endpointLabels)
		.join("path")
		.attr("class", "line-label-leader")
		.attr("stroke", endpoint => endpoint.item.color)
		.attr("d", endpoint => `M${x(endpoint.point.year)},${endpoint.pointY}H${innerWidth + 6}V${endpoint.labelY}H${innerWidth + 10}`);
	plot.selectAll(".line-end-label")
		.data(endpointLabels)
		.join("text")
		.attr("class", "line-end-label")
		.attr("x", innerWidth + 13)
		.attr("y", endpoint => endpoint.labelY)
		.attr("dy", "0.35em")
		.attr("fill", endpoint => endpoint.item.color)
		.text(endpoint => endpoint.item.label);

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
