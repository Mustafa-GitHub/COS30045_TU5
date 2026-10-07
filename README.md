# T05: D3 Multi-chart Webpage

**Author:** Muhammad Mustafa ADIL (104402516), COS30045 Data Visualisation, Swinburne University of Technology Sarawak

**Live site:** https://cos30045tu5.vercel.app/

## About
This dashboard compares TV energy use by star rating and screen technology, and shows how wholesale electricity prices have changed over time. It focuses on Australian TV models and highlights the link between efficiency, screen type, and yearly electricity use.

## Charts
- Scatter plot: shows the relationship between star rating and annual energy use for groups of TV models (same brand, technology and size), using Ex5_TV_energy.csv.
- Donut chart: shows each screen technology’s share of total TV energy use, using Ex5_TV_energy.csv.
- Bar chart: compares average annual energy use for 55-inch TVs by screen technology, using Ex5_TV_energy_55inchtv_byScreenType.csv.
- Line chart: shows electricity spot prices over time by state and average, using Ex5_ARE_Spot_Prices.csv.

## Data
- Ex5_TV_energy.csv — Australian Government energy-rating data for TV models.
- Ex5_TV_energy_55inchtv_byScreenType.csv — Australian Government energy-rating data, filtered to 55-inch TV models by screen technology.
- Ex5_TV_energy_Allsizes_byScreenType.csv — Australian Government energy-rating data, grouped by screen technology across all screen sizes.
- Ex5_ARE_Spot_Prices.csv — Annual average electricity spot prices by region ($/MWh). Provided by the COS30045 teaching team, likely sourced from the Australian Energy Regulator (AER) wholesale market statistics. The "Average" column excludes Tasmania and Snowy.

## Data processing
- The code renames LCD (LED) to LED so the labels match the chart legend and data categories.
- Empty cells are treated as missing values, so the line chart can handle gaps in the spot price data.
- Donut totals are calculated as energy use multiplied by model count, which matches the share of total energy use across screen technologies.

## Design choices
- The palette uses a consistent colour-blind safe colour set for screen technologies.
- The layout is responsive and adapts to smaller screens without breaking the chart view.
- Chart titles are finding-led, so they explain the main takeaway rather than just naming the chart.

## Tech used
- HTML
- CSS
- JavaScript
- D3 v7
- GitHub Copilot
- Vercel

## How to run locally
Open the project folder in VS Code and run it with the Live Server extension. The charts use D3 to load CSV files, so they will not work correctly if the page is opened by double-clicking the HTML file from the filesystem. A local web server is required.

## Project structure
```text
COS30045_TU5/
├── css/
│   └── styles.css
├── data/
│   ├── Ex5_ARE_Spot_Prices.csv
│   ├── Ex5_TV_energy.csv
│   ├── Ex5_TV_energy_55inchtv_byScreenType.csv
│   └── Ex5_TV_energy_Allsizes_byScreenType.csv
├── js/
│   ├── bar.js
│   ├── donut.js
│   ├── line.js
│   ├── scatter.js
│   └── shared.js
├── index.html
├── README.md
└── .gitattributes
```
