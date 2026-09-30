function cleanTech(value) {
	return value === "LCD (LED)" ? "LED" : value;
}

const techColour = d3.scaleOrdinal()
	.domain(["LCD", "LED", "OLED"])
	.range(["#0072B2", "#E69F00", "#009E73"]);

function addLegend(selector) {
	const legend = d3.select(selector)
		.append("div")
		.attr("class", "tech-legend")
		.attr("role", "list");

	const items = legend.selectAll(".tech-legend__item")
		.data(techColour.domain())
		.join("div")
		.attr("class", "tech-legend__item")
		.attr("role", "listitem");

	items.append("span")
		.attr("class", "tech-legend__swatch")
		.attr("aria-hidden", "true")
		.style("background-color", technology => techColour(technology));

	items.append("span")
		.attr("class", "tech-legend__label")
		.text(technology => technology);

	return legend;
}
