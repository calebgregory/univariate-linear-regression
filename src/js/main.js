var bucket = {}; // our global variable
bucket.linearRegression = {};
var lr = bucket.linearRegression;

bucket.data = [
  { x : 5   , y : 4 },
  { x : 100 , y : 106 }
];
var data = bucket.data;

// SCATTER PLOT SETUP

bucket.scatterplot = {}; // bucket for the scatter plot
var sp = bucket.scatterplot; // convenience variable
sp.margin = { top: 20, right: 20, bottom: 30, left: 40 };
sp.width = 600 - sp.margin.left - sp.margin.right;
sp.height= 313 - sp.margin.top - sp.margin.bottom;

// setup x
sp.xValue = function(d) { return d.x; }; // data -> value
sp.xScale = d3.scale.linear()
  .domain([0,100])
  .range([0, sp.width]); // value -> display
sp.xMap = function(d) { return sp.xScale(sp.xValue(d)); }; // data -> display
sp.xAxis = d3.svg.axis()
  .scale(sp.xScale)
  .orient("bottom");

// setup y
sp.yValue = function(d) { return d.y; }; // data -> value
sp.yScale = d3.scale.linear()
  .domain([0,100])
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
    .text("x");

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
    .text("y");

// CHANGES TO SCATTER PLOT
function update() {

  // buffer added to data domain to prevent overlapping axis
//  sp.xScale.domain([d3.min(data,sp.xValue)-1, d3.max(data,sp.xValue)+1]);
//  sp.yScale.domain([d3.min(data,sp.yValue)-1, d3.max(data,sp.yValue)+1]);
  sp.xScale.domain([0,100]);
  sp.yScale.domain([0,100]);
  sp.colorScale.domain([d3.min(data,sp.yValue)-1,d3.max(data,sp.yValue)+1]).nice();

  // update axes
  sp.svg.select(".x.axis")
    .transition()
    .duration(1000)
    .call(sp.xAxis);

  sp.svg.select(".y.axis")
    .transition()
    .duration(1000)
    .call(sp.yAxis);

  // dots
  var dots = sp.svg.selectAll(".dot")
    .data(data)
    .attr({
      class : "dot",
      r     : 3.5,
      cx    : sp.xMap,
      cy    : sp.yMap
    })
    .style("fill", function(d) { return sp.colorScale(sp.yValue(d)); })

  dots.enter()
    .append("circle")
    .attr({
      class : "dot",
      r     : 3.5,
      cx    : sp.xMap,
      cy    : sp.yMap
    })
    .style("fill", function(d) { return sp.colorScale(sp.yValue(d)); })
    .on("click", function(d,i) {
      if (data.length > 2) {
        data.splice(i,1);
      } else {
        alert('hey man, not cool. \n\neveryone knows there have to exist at least two points for a line to exist.')
      }
      update();
    });

  dots.exit().remove();

  // calculate theta values using gradient descent
  // begins with a "guess", which is theta_0 = 0, theta_1 = 0
  // a.k.a. - the x-axis (y = 0 * x + 0 => y = 0)
  lr.alpha = 0.00003,
  lr.theta = lr.theta || [0,0],
  lr.jHistory = [],
  lr.thetaHistory = [];
  var i = 0,
      difference = function() {
        return lr.jHistory[i-2] ?
          lr.jHistory[i-2] - lr.jHistory[i-1] :
          1;
      };

  do {
    lr.theta = gradientDescent(data,lr.alpha,lr.theta);
    lr.jHistory.push(J(data,lr.theta));
    lr.thetaHistory.push(lr.theta);
    i++;
  } while (difference() > 0.005);

  var maxX = d3.max(bucket.data,sp.xValue);
  // var minX = d3.min(bucket.data,sp.xValue);
  var minX = 0;
  sp.svg.selectAll("line").remove();
  var lineOfBestFit = sp.svg.append("line")
    .attr({
      x1 : sp.xScale(minX),
      y1 : sp.yScale(minX*lr.theta[1] + lr.theta[0]),
      x2 : sp.xScale(maxX),
      y2 : sp.yScale(maxX*lr.theta[1] + lr.theta[0]),
      "stroke" : "#1CDEC4",
      "stroke-width" : 2
    });

  // display the equation for the line of best fit
  var docFrag = document.createDocumentFragment();
  var p = document.createElement('P');
  docFrag.appendChild(p);
  var pText = document.createTextNode(`y = ${lr.theta[1].toPrecision(3)}x + ${lr.theta[0].toPrecision(3)}`);
  p.appendChild(pText);
  $("#equation").empty();
  $("#equation").append(p);
};
update();

// adds a new, randomly generated datum to graph
d3.select("#add")
  .on("click", function() {
    var newDot = {};
    newDot.x = Math.floor(Math.random() * 100);
    newDot.y = Math.floor(Math.random() * 100);
    data.push(newDot);
    update();
  });

