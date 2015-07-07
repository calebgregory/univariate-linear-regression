var samplebucket = {}; // our global variable
samplebucket.sampleLinearRegression = {};
var slr = samplebucket.sampleLinearRegression;

// SCATTER PLOT SETUP

samplebucket.sampleScatterplot = {}; // bucket for the scatter plot
var ssp = samplebucket.sampleScatterplot; // convenience variable
ssp.margin = { top: 20, right: 20, bottom: 30, left: 40 };
ssp.width = 480 - ssp.margin.left - ssp.margin.right;
ssp.height= 250 - ssp.margin.top - ssp.margin.bottom;

// setup x
ssp.xValue = function(d) { return d.x; }; // data -> value
ssp.xScale = d3.scale.linear()
  .domain([0,100])
  .range([0, ssp.width]); // value -> dissplay
ssp.xMap = function(d) { return ssp.xScale(ssp.xValue(d)); }; // data -> dissplay
ssp.xAxis = d3.svg.axis()
  .scale(ssp.xScale)
  .orient("bottom");

// setup y
ssp.yValue = function(d) { return d.y; }; // data -> value
ssp.yScale = d3.scale.linear()
  .domain([0,100])
  .range([ssp.height,0]); // value -> dissplay
ssp.yMap = function(d) { return ssp.yScale(ssp.yValue(d)); }; // data -> dissplay
ssp.yAxis = d3.svg.axis()
  .scale(ssp.yScale)
  .orient("left");

// setup color scale
ssp.colorScale = d3.scale.linear()
  .range(["hsl(20,90%,40%)", "hsl(180,60%,40%)"]);

// add graph canvas to #scatterplot div
ssp.svg = d3.select("#samplescatterplot").append("svg")
    .attr("width", ssp.width + ssp.margin.left + ssp.margin.right)
    .attr("height", ssp.height + ssp.margin.bottom + ssp.margin.top)
  .append("g")
    .attr("transform", `translate(${ssp.margin.left},${ssp.margin.top})`);

// x-axis
ssp.svg.append("g")
    .attr({
      class : "x axis",
      transform : `translate(0,${ssp.height})`
    })
    .call(ssp.xAxis)
  .append("text")
    .attr({
      class : "label",
      x     : ssp.width,
      y     : -6
    })
    .style("text-anchor", "end")
    .text("Population (10,000s)");

// y-axis
ssp.svg.append("g")
    .attr("class", "y axis")
    .call(ssp.yAxis)
  .append("text")
    .attr({
      class : "label",
      transform : "rotate(-90)",
      y     : 6,
      dy    : ".71em"
    })
    .style("text-anchor", "end")
    .text("Profit ($10,000s)");

// load data
d3.select("#run")
  .on("click", function() {

    d3.csv('../data.csv',
      function(err, data) {
        if(err) throw err;

        // change from CSV string into number format
        data.forEach(function(d) {
          d.x = +d.population;
          d.y     = +d.profit;
        });
        samplebucket.data = data;

        // CHANGES TO SCATTER PLOT

        // buffer added to data domain to prevent overlapping axis
        ssp.xScale.domain([d3.min(data,ssp.xValue)-1, d3.max(data,ssp.xValue)+1]);
        ssp.yScale.domain([d3.min(data,ssp.yValue)-1, d3.max(data,ssp.yValue)+1]);
        ssp.colorScale.domain([d3.min(data,ssp.yValue)-1,d3.max(data,ssp.yValue)+1]).nice();

        // change axes labels
        ssp.svg.select(".x.axis")
          .transition()
          .duration(1000)
          .call(ssp.xAxis);

        ssp.svg.select(".y.axis")
          .transition()
          .duration(1000)
          .call(ssp.yAxis);

        var dots = ssp.svg.selectAll(".sampledot")
            .data(data);
        dots
          .enter()
          .append("circle")
            .attr("class", "sampledot");
        dots
          .transition()
            .delay(function(d,i) { return i * 50;})
            .attr({
              r     : 3.5,
              cx    : ssp.xMap,
              cy    : ssp.yMap
            })
            .style("fill", function(d) { return ssp.colorScale(ssp.yValue(d)); })
            .each("end", function(d,i) {
              if (i === data.length - 1) {
                drawLine();
              }
            });
        function drawLine() {
          var max = d3.max(samplebucket.data,ssp.xValue);
          var min = d3.min(samplebucket.data,ssp.xValue);
          var lineOfBestFit = ssp.svg.append("line")
            .attr({
              x1 : ssp.xScale(min),
              y1 : ssp.yScale(min*slr.theta[1] + slr.theta[0]),
              x2 : ssp.xScale(max),
              y2 : ssp.yScale(max*slr.theta[1] + slr.theta[0]),
              "stroke" : "#1CDEC4",
              "stroke-width" : 2
            });
        }

        slr.alpha = 0.004,
        slr.theta = [0,0],
        slr.jHistory = [],
        slr.thetaHistory = [];
        var i = 0,
            difference = function() {
              return slr.jHistory[i-2] ?
                slr.jHistory[i-2] - slr.jHistory[i-1] :
                1;
            };

        do {
          slr.theta = gradientDescent(data,slr.alpha,slr.theta);
          slr.jHistory.push(J(data,slr.theta));
          slr.thetaHistory.push(slr.theta);
          i++;
        } while (difference() > .0001);

        // debugger;
      });
  })
