define('multiCalendarHeatmap',['d3'], function (d3) {

	 return function (instanceData) {

		 /* Script constants:
		 			If you plan to change the colors used in this component,
					make sure to update COLOR_CLASS and COLOR_COUNT with the
					new values. Default is a yellow-orange-red sequential
					color scale with 5 color classes.
		  */

		    //fiscal years
		    const BEGIN_YEAR  = parseInt(instanceData.begin_year) - 1;
		 		const END_YEAR    = parseInt(instanceData.end_year) + 1;

		 		//colorbrewer2.org
		 		const COLOR_CLASS = "YlOrRd";
		 		const COLOR_COUNT = 5;

				const DATASET = instanceData.series[0];



		 /* SVG variables and layout control */

		 	 	const width = instanceData.width;
		    const height = instanceData.cell_size * 8;

		 		const cellSize = instanceData.cell_size;

				//see 'function dateString(d)' for tooltip date-formatter.
		 		const dateFormatter = d3.time.format("%Y-%m-%d");
				const measureFormatter = d3.format(instanceData.measure_format);



			/* SVG elements */

				//primary SVG element
		 		var svg = d3.select("#" + instanceData.id).selectAll("svg")
		 		    .data(d3.range(BEGIN_YEAR, END_YEAR))
		 		  .enter().append("svg")
		 		    .attr("width", width)
		 		    .attr("height", height)
		 		    .attr("class", COLOR_CLASS)
		 		  .append("g")
		 		    .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + ","
																						+ (height - cellSize * 7 - 1) + ")"  );

				//title of each calendar
		 		svg.append("text")
		 		    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
		 		    .style("text-anchor", "middle")
						.style("fill", "black")
						.style("font-size", instanceData.font_size)
						.style("font-family", "Arial")
		 		    .text(function(d) { return d; });



			/* Calendar rendering */

				//draws the grid of day-cells.
		 		var rect = svg.selectAll(".day")
		 		    .data(function(d) {
							return d3.time.days( new Date(d, 0, 1), new Date(d + 1, 0, 1) );
						})
		 		  .enter().append("rect")
		 		    .attr("class", "day")
		 		    .attr("width", cellSize)
		 		    .attr("height", cellSize)
		 		    .attr("x", function(d) {
							return d3.time.weekOfYear(d) * cellSize;
						})
		 		    .attr("y", function(d) {
							return height - (cellSize*2) - (d.getDay() * cellSize);
						})
		 		    .datum( dateFormatter );

				//shows date in tooltip
		 		rect.append("title")
		 		    .text(function(d) { return dateString(d); });

				//outlines the months for each year
		 		svg.selectAll(".month")
		 		    .data(function(d) {
							return d3.time.months( new Date(d, 0, 1), new Date(d + 1, 0, 1) );
						})
		 		  .enter().append("path")
		 		    .attr("class", "month")
		 		    .attr("d", monthPath)
		 				.attr("transform", "scale(-1, 1) rotate(180) translate(0, "+-7*cellSize+")");



			/* Color-scale function:
						The color-scale function maps the values of the dataset
						uniformly to the color classes. If there are 5 color classes,
						for example, then this function will categorize the values of
						the dataset into 5 groups of equal size; when you supply it a
						number, the function will return the CSS class name that it
						belongs to.
			 */

				var values = [];
	 		  DATASET.forEach(function(d) {
	 			  values.push(d.count);
	 		  });

				var domain = [d3.min(values), d3.max(values)];

				var	range = d3.range(COLOR_COUNT).map(function(d) {
											 return "q" +d+ "-" +COLOR_COUNT;
										 });

				var color = d3.scale.quantize()
						.domain(domain)
						.range(range);



			/* Data manipulation and rendering */

				var data = {};
				DATASET.forEach(function(d) {
				  data[d.date] = d.count;
			  });

				//assigns a color to each day-cell, shows the measure value in tooltip.
				rect.filter(function(d) { return d in data; })
						.attr("class", function(d) { return "day " + color(data[d]); })
						.select("title").text(function(d) {
							return dateString(d) + ":   " + measureFormatter(data[d]);
						});



			/* Helper functions */

				//draws the outline of the months for each calendar.
		 		function monthPath(t0) {
		 		  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
		 		      d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
		 		      d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);

		 		  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
		 		      + "H" + w0 * cellSize + "V" + 7 * cellSize
		 		      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
		 		      + "H" + (w1 + 1) * cellSize + "V" + 0
		 		      + "H" + (w0 + 1) * cellSize + "Z";
		 		}

				//formats the datestring in the tooltip.
				function dateString(d) {
					let currentDay = parseInt( d.slice(8,10) );
					let currentMonth = parseInt( d.slice(5,7) ) - 1;
					let currentYear = parseInt( d.slice(0,4) );

					let date = new Date(currentYear, currentMonth, currentDay);

					return d3.time.format(instanceData.date_format)(date);
				}

				//print the color-scale ranges to the console.
				/*
				for(var i=0; i<COLOR_COUNT; i++) {
				 console.log(COLOR_CLASS, color.invertExtent("q" +i+ "-"+COLOR_COUNT));
				}
				*/



	};

});
