var bucket = {}; // our global variable


// SCATTER PLOT SETUP

bucket.scatterplot = {}; // bucket for the scatter plot
var sp = bucket.scatterplot; // convenience variable
sp.margin = { top: 20, right: 20, bottom: 30, left: 40 };
sp.width = 480 - sp.margin.left - sp.margin.right;
sp.height= 250 - sp.margin.top - sp.margin.bottom;

// setup x
sp.xValue = function(d) { return d.population; }; // data -> value
sp.xScale = d3.scale.linear()
  .range([0, sp.width]); // value -> display
sp.xMap = function(d) { return sp.xScale(sp.xValue(d)); }; // data -> display
sp.xAxis = d3.svg.axis()
  .scale(sp.xScale)
  .orient("bottom");

// setup y
sp.yValue = function(d) { return d.profit; }; // data -> value
sp.yScale = d3.scale.linear()
  .range([sp.height,0]); // value -> display
sp.yMap = function(d) { return sp.yScale(sp.yValue(d)); }; // data -> display
sp.yAxis = d3.svg.axis()
  .scale(sp.yScale)
  .orient("left");

// setup color scale
sp.colorScale = d3.scale.linear()
  .range(["hsl(20,90%,40%)", "hsl(180,60%,40%)"]);

// add graph canvas to #scatterplot div
sp.svg = d3.select("#scatterplot").append("svg")
    .attr("width", sp.width + sp.margin.left + sp.margin.right)
    .attr("height", sp.height + sp.margin.bottom + sp.margin.top)
  .append("g")
    .attr("transform", `translate(${sp.margin.left},${sp.margin.top})`);


// THREE DIMENSIONAL SURFACE PLOT

bucket.surfaceplot = {}; // bucket for the cost function J(theta_0,theta_1)
var sf = bucket.surfaceplot; // convenience variable
sf.margin = { top: 20, right: 20, bottom: 30, left: 40 };
sf.width = 480 - sf.margin.left - sf.margin.right;
sf.height= 250 - sf.margin.top - sf.margin.bottom;



// load data
d3.csv('../_data/data.csv',
  function(err, data) {
    if(err) throw err;

    // change from CSV string into number format
    data.forEach(function(d) {
      d.population = +d.population;
      d.profit     = +d.profit;
    });
    bucket.data = data;

    // CHANGES TO SCATTER PLOT

    // buffer added to data domain to prevent overlapping axis
    sp.xScale.domain([d3.min(data,sp.xValue)-1, d3.max(data,sp.xValue)+1]);
    sp.yScale.domain([d3.min(data,sp.yValue)-1, d3.max(data,sp.yValue)+1]);
    sp.colorScale.domain([d3.min(data,sp.yValue)-1,d3.max(data,sp.yValue)+1]).nice();

    // x-axis
    sp.svg.append("g")
        .attr({
          class : "x axis",
          transform : `translate(0,${sp.height})`
        })
        .call(sp.xAxis)
      .append("text")
        .attr({
          class : "label",
          x     : sp.width,
          y     : -6
        })
        .style("text-anchor", "end")
        .text("Population (10,000s)");

    // y-axis
    sp.svg.append("g")
        .attr("class", "y axis")
        .call(sp.yAxis)
      .append("text")
        .attr({
          class : "label",
          transform : "rotate(-90)",
          y     : 6,
          dy    : ".71em"
        })
        .style("text-anchor", "end")
        .text("Profit ($10,000s)");

    sp.svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr({
          class : "dot",
          r     : 3.5,
          cx    : sp.xMap,
          cy    : sp.yMap
        })
        .style("fill", function(d) { return sp.colorScale(sp.yValue(d)); });


    // CHANGES TO THREE DIMENSIONAL SURFACE PLOT

    var alpha = 0.01,
        theta = [0,0],
        J_history = [],
        i = 0,
        difference = function() {
          return J_history[i-2] ?
            J_history[i-2] - J_history[i-1] :
            1;
        };

    do {
      theta = gradientDescent(data,alpha,theta);
      J_history.push(J(data,theta));
      i++;
    } while (difference() > 0.0001);
    debugger;
  });
