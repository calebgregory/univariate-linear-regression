"use strict";

var diybucket = {}; // our global variable
diybucket.linearRegression = {};
var diylr = diybucket.linearRegression;
diylr.alpha = 0.0003;
diylr.theta = [0, 0];
diylr.iterations = 0;

diybucket.data = [{ x: 5, y: 4 }, { x: 15, y: 20 }, { x: 30, y: 45 }, { x: 12, y: 15 }, { x: 60, y: 70 }, { x: 55, y: 69 }, { x: 29, y: 30 }, { x: 44, y: 40 }, { x: 78, y: 89 }, { x: 90, y: 95 }, { x: 69, y: 77 }, { x: 74, y: 74 }, { x: 60, y: 66 }, { x: 100, y: 96 }];

// SCATTER PLOT SETUP

diybucket.scatterplot = {}; // diybucket for the scatter plot
var diysp = diybucket.scatterplot; // convenience variable
diysp.margin = { top: 20, right: 20, bottom: 30, left: 40 };
diysp.width = 600 - diysp.margin.left - diysp.margin.right;
diysp.height = 313 - diysp.margin.top - diysp.margin.bottom;

// setup x
diysp.xValue = function (d) {
  return d.x;
}; // data -> value
diysp.xScale = d3.scale.linear().domain([0, 100]).range([0, diysp.width]); // value -> didiysplay
diysp.xMap = function (d) {
  return diysp.xScale(diysp.xValue(d));
}; // data -> didiysplay
diysp.xAxis = d3.svg.axis().scale(diysp.xScale).orient("bottom");

// setup y
diysp.yValue = function (d) {
  return d.y;
}; // data -> value
diysp.yScale = d3.scale.linear().domain([0, 100]).range([diysp.height, 0]); // value -> didiysplay
diysp.yMap = function (d) {
  return diysp.yScale(diysp.yValue(d));
}; // data -> didiysplay
diysp.yAxis = d3.svg.axis().scale(diysp.yScale).orient("left");

// setup color scale
diysp.colorScale = d3.scale.linear().range(["hsl(20,90%,40%)", "hsl(180,60%,40%)"]);

// add graph canvas to #scatterplot div
diysp.svg = d3.select("#diyscatterplot").append("svg").attr("width", diysp.width + diysp.margin.left + diysp.margin.right).attr("height", diysp.height + diysp.margin.bottom + diysp.margin.top).append("g").attr("transform", "translate(" + diysp.margin.left + "," + diysp.margin.top + ")");

// x-axis
diysp.svg.append("g").attr({
  "class": "x axis",
  transform: "translate(0," + diysp.height + ")"
}).call(diysp.xAxis).append("text").attr({
  "class": "label",
  x: diysp.width,
  y: -6
}).style("text-anchor", "end").text("x");

// y-axis
diysp.svg.append("g").attr("class", "y axis").call(diysp.yAxis).append("text").attr({
  "class": "label",
  transform: "rotate(-90)",
  y: 6,
  dy: ".71em"
}).style("text-anchor", "end").text("y");

// CHANGES TO SCATTER PLOT
diybucket.update = function () {

  // buffer added to data domain to prevent overlapping axis
  //  diysp.xScale.domain([d3.min(data,diysp.xValue)-1, d3.max(data,diysp.xValue)+1]);
  //  diysp.yScale.domain([d3.min(data,diysp.yValue)-1, d3.max(data,diysp.yValue)+1]);
  diysp.xScale.domain([0, 100]);
  diysp.yScale.domain([0, 100]);
  diysp.colorScale.domain([d3.min(diybucket.data, diysp.yValue) - 1, d3.max(diybucket.data, diysp.yValue) + 1]).nice();

  // update axes
  diysp.svg.select(".x.axis").transition().duration(1000).call(diysp.xAxis);

  diysp.svg.select(".y.axis").transition().duration(1000).call(diysp.yAxis);

  // dots
  var dots = diysp.svg.selectAll(".dot").data(diybucket.data).attr({
    "class": "dot",
    r: 3.5,
    cx: diysp.xMap,
    cy: diysp.yMap
  }).style("fill", function (d) {
    return diysp.colorScale(diysp.yValue(d));
  });

  dots.enter().append("circle").attr({
    "class": "dot",
    r: 3.5,
    cx: diysp.xMap,
    cy: diysp.yMap
  }).style("fill", function (d) {
    return diysp.colorScale(diysp.yValue(d));
  }).on("click", function (d, i) {
    if (diybucket.data.length > 2) {
      diybucket.data.splice(i, 1);
    } else {
      alert("hey man, not cool. \n\neveryone knows there have to exist at least two points for a line to exist.");
    }
    diybucket.update();
  });

  dots.exit().remove();

  // calculate theta values using gradient descent
  // begins with a "guess", which is theta_0 = 0, theta_1 = 0
  // a.k.a. - the x-axis (y = 0 * x + 0 => y = 0)

  diylr.alpha = diylr.alpha || 0.0003, diylr.theta = diylr.theta || [0, 0], diylr.jHistory = [], diylr.thetaHistory = [];
  var i = 0,
      difference = function difference() {
    if (i < 150000) {
      return diylr.jHistory[i - 2] ? diylr.jHistory[i - 2] - diylr.jHistory[i - 1] : 1;
    }
    return 0;
  };

  do {
    diylr.theta = gradientDescent(diybucket.data, diylr.alpha, diylr.theta);
    diylr.jHistory.push(J(diybucket.data, diylr.theta));
    diylr.thetaHistory.push(diylr.theta);
    i++;
  } while (difference() > 0.0001);

  diylr.iterations = i;

  var maxX = d3.max(diybucket.data, diysp.xValue);
  // var minX = d3.min(diybucket.data,diysp.xValue);
  var minX = 0;
  diysp.svg.selectAll("line").remove();
  var lineOfBestFit = diysp.svg.append("line").attr({
    x1: diysp.xScale(minX),
    y1: diysp.yScale(minX * diylr.theta[1] + diylr.theta[0]),
    x2: diysp.xScale(maxX),
    y2: diysp.yScale(maxX * diylr.theta[1] + diylr.theta[0]),
    "stroke": "#1CDEC4",
    "stroke-width": 2
  });

  // display the equation for the line of best fit
  var docFrag = document.createDocumentFragment();
  var eq = document.createElement("P");
  docFrag.appendChild(eq);
  var eqText = document.createTextNode("y = " + diylr.theta[1].toPrecision(3) + "x + " + diylr.theta[0].toPrecision(3));
  eq.appendChild(eqText);
  $("#diyequation").empty();
  $("#diyequation").append(docFrag);

  var docFrag2 = document.createDocumentFragment();
  var numIters = document.createElement("P");
  docFrag2.appendChild(numIters);
  var numItersText = document.createTextNode("number of iterations: " + diylr.iterations);
  numIters.appendChild(numItersText);
  $("#num-iters").empty();
  $("#num-iters").append(docFrag2);
};
diybucket.update();

// adds a new, randomly generated datum to graph
d3.select("#diyadd").on("click", function () {
  var newDot = {};
  newDot.x = Math.floor(Math.random() * 100);
  newDot.y = Math.floor(Math.random() * 100);
  diybucket.data.push(newDot);
  diybucket.update();
});

$("#diyvals").on("submit", function () {
  diylr.theta[0] = $("#diyvals input:nth-child(1)").val();
  diylr.theta[1] = $("#diyvals input:nth-child(2)").val();
  diylr.alpha = $("#diyvals input:nth-child(3)").val();
  event.preventDefault();
  diybucket.update();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9qcy9kaXlzY2F0dGVycGxvdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNuQixTQUFTLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0FBQ2hDLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztBQUN2QyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztBQUNyQixLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDOztBQUVyQixTQUFTLENBQUMsSUFBSSxHQUFHLENBQ2YsRUFBRSxDQUFDLEVBQUcsQ0FBQyxFQUFLLENBQUMsRUFBRyxDQUFDLEVBQUUsRUFDbkIsRUFBRSxDQUFDLEVBQUcsRUFBRSxFQUFJLENBQUMsRUFBRyxFQUFFLEVBQUMsRUFDbkIsRUFBRSxDQUFDLEVBQUcsRUFBRSxFQUFJLENBQUMsRUFBRyxFQUFFLEVBQUMsRUFDbkIsRUFBRSxDQUFDLEVBQUcsRUFBRSxFQUFJLENBQUMsRUFBRyxFQUFFLEVBQUMsRUFDbkIsRUFBRSxDQUFDLEVBQUcsRUFBRSxFQUFJLENBQUMsRUFBRyxFQUFFLEVBQUMsRUFDbkIsRUFBRSxDQUFDLEVBQUcsRUFBRSxFQUFJLENBQUMsRUFBRyxFQUFFLEVBQUMsRUFDbkIsRUFBRSxDQUFDLEVBQUcsRUFBRSxFQUFJLENBQUMsRUFBRyxFQUFFLEVBQUMsRUFDbkIsRUFBRSxDQUFDLEVBQUcsRUFBRSxFQUFJLENBQUMsRUFBRyxFQUFFLEVBQUMsRUFDbkIsRUFBRSxDQUFDLEVBQUcsRUFBRSxFQUFJLENBQUMsRUFBRyxFQUFFLEVBQUMsRUFDbkIsRUFBRSxDQUFDLEVBQUcsRUFBRSxFQUFJLENBQUMsRUFBRyxFQUFFLEVBQUMsRUFDbkIsRUFBRSxDQUFDLEVBQUcsRUFBRSxFQUFJLENBQUMsRUFBRyxFQUFFLEVBQUMsRUFDbkIsRUFBRSxDQUFDLEVBQUcsRUFBRSxFQUFJLENBQUMsRUFBRyxFQUFFLEVBQUMsRUFDbkIsRUFBRSxDQUFDLEVBQUcsRUFBRSxFQUFJLENBQUMsRUFBRyxFQUFFLEVBQUMsRUFDbkIsRUFBRSxDQUFDLEVBQUcsR0FBRyxFQUFHLENBQUMsRUFBRyxFQUFFLEVBQUMsQ0FDcEIsQ0FBQzs7OztBQUlGLFNBQVMsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQzNCLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUM7QUFDbEMsS0FBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUM1RCxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUMzRCxLQUFLLENBQUMsTUFBTSxHQUFFLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQzs7O0FBRzNELEtBQUssQ0FBQyxNQUFNLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFBRSxTQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FBRSxDQUFDO0FBQzNDLEtBQUssQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FDN0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQ2YsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzNCLEtBQUssQ0FBQyxJQUFJLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFBRSxTQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMs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Q0FBQyxDQUFDLDZCQUE2QixDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDeEQsT0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyRCxPQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdkIsV0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO0NBQ3BCLENBQUMsQ0FBQyIsImZpbGUiOiJzcmMvanMvZGl5c2NhdHRlcnBsb3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZGl5YnVja2V0ID0ge307IC8vIG91ciBnbG9iYWwgdmFyaWFibGVcbmRpeWJ1Y2tldC5saW5lYXJSZWdyZXNzaW9uID0ge307XG52YXIgZGl5bHIgPSBkaXlidWNrZXQubGluZWFyUmVncmVzc2lvbjtcbmRpeWxyLmFscGhhID0gMC4wMDAzO1xuZGl5bHIudGhldGEgPSBbMCwwXTtcbmRpeWxyLml0ZXJhdGlvbnMgPSAwO1xuXG5kaXlidWNrZXQuZGF0YSA9IFtcbiAgeyB4IDogNSAgICwgeSA6IDQgfSxcbiAgeyB4IDogMTUgICwgeSA6IDIwfSxcbiAgeyB4IDogMzAgICwgeSA6IDQ1fSxcbiAgeyB4IDogMTIgICwgeSA6IDE1fSxcbiAgeyB4IDogNjAgICwgeSA6IDcwfSxcbiAgeyB4IDogNTUgICwgeSA6IDY5fSxcbiAgeyB4IDogMjkgICwgeSA6IDMwfSxcbiAgeyB4IDogNDQgICwgeSA6IDQwfSxcbiAgeyB4IDogNzggICwgeSA6IDg5fSxcbiAgeyB4IDogOTAgICwgeSA6IDk1fSxcbiAgeyB4IDogNjkgICwgeSA6IDc3fSxcbiAgeyB4IDogNzQgICwgeSA6IDc0fSxcbiAgeyB4IDogNjAgICwgeSA6IDY2fSxcbiAgeyB4IDogMTAwICwgeSA6IDk2fVxuXTtcblxuLy8gU0NBVFRFUiBQTE9UIFNFVFVQXG5cbmRpeWJ1Y2tldC5zY2F0dGVycGxvdCA9IHt9OyAvLyBkaXlidWNrZXQgZm9yIHRoZSBzY2F0dGVyIHBsb3RcbnZhciBkaXlzcCA9IGRpeWJ1Y2tldC5zY2F0dGVycGxvdDsgLy8gY29udmVuaWVuY2UgdmFyaWFibGVcbmRpeXNwLm1hcmdpbiA9IHsgdG9wOiAyMCwgcmlnaHQ6IDIwLCBib3R0b206IDMwLCBsZWZ0OiA0MCB9O1xuZGl5c3Aud2lkdGggPSA2MDAgLSBkaXlzcC5tYXJnaW4ubGVmdCAtIGRpeXNwLm1hcmdpbi5yaWdodDtcbmRpeXNwLmhlaWdodD0gMzEzIC0gZGl5c3AubWFyZ2luLnRvcCAtIGRpeXNwLm1hcmdpbi5ib3R0b207XG5cbi8vIHNldHVwIHhcbmRpeXNwLnhWYWx1ZSA9IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQueDsgfTsgLy8gZGF0YSAtPiB2YWx1ZVxuZGl5c3AueFNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcbiAgLmRvbWFpbihbMCwxMDBdKVxuICAucmFuZ2UoWzAsIGRpeXNwLndpZHRoXSk7IC8vIHZhbHVlIC0+IGRpZGl5c3BsYXlcbmRpeXNwLnhNYXAgPSBmdW5jdGlvbihkKSB7IHJldHVybiBkaXlzcC54U2NhbGUoZGl5c3AueFZhbHVlKGQpKTsgfTsgLy8gZGF0YSAtPiBkaWRpeXNwbGF5XG5kaXlzcC54QXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgLnNjYWxlKGRpeXNwLnhTY2FsZSlcbiAgLm9yaWVudChcImJvdHRvbVwiKTtcblxuLy8gc2V0dXAgeVxuZGl5c3AueVZhbHVlID0gZnVuY3Rpb24oZCkgeyByZXR1cm4gZC55OyB9OyAvLyBkYXRhIC0+IHZhbHVlXG5kaXlzcC55U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAuZG9tYWluKFswLDEwMF0pXG4gIC5yYW5nZShbZGl5c3AuaGVpZ2h0LDBdKTsgLy8gdmFsdWUgLT4gZGlkaXlzcGxheVxuZGl5c3AueU1hcCA9IGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRpeXNwLnlTY2FsZShkaXlzcC55VmFsdWUoZCkpOyB9OyAvLyBkYXRhIC0+IGRpZGl5c3BsYXlcbmRpeXNwLnlBeGlzID0gZDMuc3ZnLmF4aXMoKVxuICAuc2NhbGUoZGl5c3AueVNjYWxlKVxuICAub3JpZW50KFwibGVmdFwiKTtcblxuLy8gc2V0dXAgY29sb3Igc2NhbGVcbmRpeXNwLmNvbG9yU2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAucmFuZ2UoW1wiaHNsKDIwLDkwJSw0MCUpXCIsIFwiaHNsKDE4MCw2MCUsNDAlKVwiXSk7XG5cbi8vIGFkZCBncmFwaCBjYW52YXMgdG8gI3NjYXR0ZXJwbG90IGRpdlxuZGl5c3Auc3ZnID0gZDMuc2VsZWN0KFwiI2RpeXNjYXR0ZXJwbG90XCIpLmFwcGVuZChcInN2Z1wiKVxuICAgIC5hdHRyKFwid2lkdGhcIiwgZGl5c3Aud2lkdGggKyBkaXlzcC5tYXJnaW4ubGVmdCArIGRpeXNwLm1hcmdpbi5yaWdodClcbiAgICAuYXR0cihcImhlaWdodFwiLCBkaXlzcC5oZWlnaHQgKyBkaXlzcC5tYXJnaW4uYm90dG9tICsgZGl5c3AubWFyZ2luLnRvcClcbiAgLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7ZGl5c3AubWFyZ2luLmxlZnR9LCR7ZGl5c3AubWFyZ2luLnRvcH0pYCk7XG5cbi8vIHgtYXhpc1xuZGl5c3Auc3ZnLmFwcGVuZChcImdcIilcbiAgICAuYXR0cih7XG4gICAgICBjbGFzcyA6IFwieCBheGlzXCIsXG4gICAgICB0cmFuc2Zvcm0gOiBgdHJhbnNsYXRlKDAsJHtkaXlzcC5oZWlnaHR9KWBcbiAgICB9KVxuICAgIC5jYWxsKGRpeXNwLnhBeGlzKVxuICAuYXBwZW5kKFwidGV4dFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIGNsYXNzIDogXCJsYWJlbFwiLFxuICAgICAgeCAgICAgOiBkaXlzcC53aWR0aCxcbiAgICAgIHkgICAgIDogLTZcbiAgICB9KVxuICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpXG4gICAgLnRleHQoXCJ4XCIpO1xuXG4vLyB5LWF4aXNcbmRpeXNwLnN2Zy5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBcInkgYXhpc1wiKVxuICAgIC5jYWxsKGRpeXNwLnlBeGlzKVxuICAuYXBwZW5kKFwidGV4dFwiKVxuICAgIC5hdHRyKHtcbiAgICAgIGNsYXNzIDogXCJsYWJlbFwiLFxuICAgICAgdHJhbnNmb3JtIDogXCJyb3RhdGUoLTkwKVwiLFxuICAgICAgeSAgICAgOiA2LFxuICAgICAgZHkgICAgOiBcIi43MWVtXCJcbiAgICB9KVxuICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpXG4gICAgLnRleHQoXCJ5XCIpO1xuXG4vLyBDSEFOR0VTIFRPIFNDQVRURVIgUExPVFxuZGl5YnVja2V0LnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXG4gIC8vIGJ1ZmZlciBhZGRlZCB0byBkYXRhIGRvbWFpbiB0byBwcmV2ZW50IG92ZXJsYXBwaW5nIGF4aXNcbi8vICBkaXlzcC54U2NhbGUuZG9tYWluKFtkMy5taW4oZGF0YSxkaXlzcC54VmFsdWUpLTEsIGQzLm1heChkYXRhLGRpeXNwLnhWYWx1ZSkrMV0pO1xuLy8gIGRpeXNwLnlTY2FsZS5kb21haW4oW2QzLm1pbihkYXRhLGRpeXNwLnlWYWx1ZSktMSwgZDMubWF4KGRhdGEsZGl5c3AueVZhbHVlKSsxXSk7XG4gIGRpeXNwLnhTY2FsZS5kb21haW4oWzAsMTAwXSk7XG4gIGRpeXNwLnlTY2FsZS5kb21haW4oWzAsMTAwXSk7XG4gIGRpeXNwLmNvbG9yU2NhbGUuZG9tYWluKFtkMy5taW4oZGl5YnVja2V0LmRhdGEsZGl5c3AueVZhbHVlKS0xLGQzLm1heChkaXlidWNrZXQuZGF0YSxkaXlzcC55VmFsdWUpKzFdKS5uaWNlKCk7XG5cbiAgLy8gdXBkYXRlIGF4ZXNcbiAgZGl5c3Auc3ZnLnNlbGVjdChcIi54LmF4aXNcIilcbiAgICAudHJhbnNpdGlvbigpXG4gICAgLmR1cmF0aW9uKDEwMDApXG4gICAgLmNhbGwoZGl5c3AueEF4aXMpO1xuXG4gIGRpeXNwLnN2Zy5zZWxlY3QoXCIueS5heGlzXCIpXG4gICAgLnRyYW5zaXRpb24oKVxuICAgIC5kdXJhdGlvbigxMDAwKVxuICAgIC5jYWxsKGRpeXNwLnlBeGlzKTtcblxuICAvLyBkb3RzXG4gIHZhciBkb3RzID0gZGl5c3Auc3ZnLnNlbGVjdEFsbChcIi5kb3RcIilcbiAgICAuZGF0YShkaXlidWNrZXQuZGF0YSlcbiAgICAuYXR0cih7XG4gICAgICBjbGFzcyA6IFwiZG90XCIsXG4gICAgICByICAgICA6IDMuNSxcbiAgICAgIGN4ICAgIDogZGl5c3AueE1hcCxcbiAgICAgIGN5ICAgIDogZGl5c3AueU1hcFxuICAgIH0pXG4gICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkaXlzcC5jb2xvclNjYWxlKGRpeXNwLnlWYWx1ZShkKSk7IH0pXG5cbiAgZG90cy5lbnRlcigpXG4gICAgLmFwcGVuZChcImNpcmNsZVwiKVxuICAgIC5hdHRyKHtcbiAgICAgIGNsYXNzIDogXCJkb3RcIixcbiAgICAgIHIgICAgIDogMy41LFxuICAgICAgY3ggICAgOiBkaXlzcC54TWFwLFxuICAgICAgY3kgICAgOiBkaXlzcC55TWFwXG4gICAgfSlcbiAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRpeXNwLmNvbG9yU2NhbGUoZGl5c3AueVZhbHVlKGQpKTsgfSlcbiAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbihkLGkpIHtcbiAgICAgIGlmIChkaXlidWNrZXQuZGF0YS5sZW5ndGggPiAyKSB7XG4gICAgICAgIGRpeWJ1Y2tldC5kYXRhLnNwbGljZShpLDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoJ2hleSBtYW4sIG5vdCBjb29sLiBcXG5cXG5ldmVyeW9uZSBrbm93cyB0aGVyZSBoYXZlIHRvIGV4aXN0IGF0IGxlYXN0IHR3byBwb2ludHMgZm9yIGEgbGluZSB0byBleGlzdC4nKVxuICAgICAgfVxuICAgICAgZGl5YnVja2V0LnVwZGF0ZSgpO1xuICAgIH0pO1xuXG4gIGRvdHMuZXhpdCgpLnJlbW92ZSgpO1xuXG4gIC8vIGNhbGN1bGF0ZSB0aGV0YSB2YWx1ZXMgdXNpbmcgZ3JhZGllbnQgZGVzY2VudFxuICAvLyBiZWdpbnMgd2l0aCBhIFwiZ3Vlc3NcIiwgd2hpY2ggaXMgdGhldGFfMCA9IDAsIHRoZXRhXzEgPSAwXG4gIC8vIGEuay5hLiAtIHRoZSB4LWF4aXMgKHkgPSAwICogeCArIDAgPT4geSA9IDApXG5cbiAgZGl5bHIuYWxwaGEgPSBkaXlsci5hbHBoYSB8fCAwLjAwMDMsXG4gIGRpeWxyLnRoZXRhID0gZGl5bHIudGhldGEgfHwgWzAsMF0sXG4gIGRpeWxyLmpIaXN0b3J5ID0gW10sXG4gIGRpeWxyLnRoZXRhSGlzdG9yeSA9IFtdO1xuICB2YXIgaSA9IDAsXG4gICAgICBkaWZmZXJlbmNlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChpIDwgMTUwMDAwKSB7XG4gICAgICAgICAgcmV0dXJuIGRpeWxyLmpIaXN0b3J5W2ktMl0gP1xuICAgICAgICAgICAgZGl5bHIuakhpc3RvcnlbaS0yXSAtIGRpeWxyLmpIaXN0b3J5W2ktMV0gOlxuICAgICAgICAgICAgMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH07XG5cbiAgZG8ge1xuICAgIGRpeWxyLnRoZXRhID0gZ3JhZGllbnREZXNjZW50KGRpeWJ1Y2tldC5kYXRhLGRpeWxyLmFscGhhLGRpeWxyLnRoZXRhKTtcbiAgICBkaXlsci5qSGlzdG9yeS5wdXNoKEooZGl5YnVja2V0LmRhdGEsZGl5bHIudGhldGEpKTtcbiAgICBkaXlsci50aGV0YUhpc3RvcnkucHVzaChkaXlsci50aGV0YSk7XG4gICAgaSsrO1xuICB9IHdoaWxlIChkaWZmZXJlbmNlKCkgPiAwLjAwMDEpO1xuXG4gIGRpeWxyLml0ZXJhdGlvbnMgPSBpO1xuXG4gIHZhciBtYXhYID0gZDMubWF4KGRpeWJ1Y2tldC5kYXRhLGRpeXNwLnhWYWx1ZSk7XG4gIC8vIHZhciBtaW5YID0gZDMubWluKGRpeWJ1Y2tldC5kYXRhLGRpeXNwLnhWYWx1ZSk7XG4gIHZhciBtaW5YID0gMDtcbiAgZGl5c3Auc3ZnLnNlbGVjdEFsbChcImxpbmVcIikucmVtb3ZlKCk7XG4gIHZhciBsaW5lT2ZCZXN0Rml0ID0gZGl5c3Auc3ZnLmFwcGVuZChcImxpbmVcIilcbiAgICAuYXR0cih7XG4gICAgICB4MSA6IGRpeXNwLnhTY2FsZShtaW5YKSxcbiAgICAgIHkxIDogZGl5c3AueVNjYWxlKG1pblgqZGl5bHIudGhldGFbMV0gKyBkaXlsci50aGV0YVswXSksXG4gICAgICB4MiA6IGRpeXNwLnhTY2FsZShtYXhYKSxcbiAgICAgIHkyIDogZGl5c3AueVNjYWxlKG1heFgqZGl5bHIudGhldGFbMV0gKyBkaXlsci50aGV0YVswXSksXG4gICAgICBcInN0cm9rZVwiIDogXCIjMUNERUM0XCIsXG4gICAgICBcInN0cm9rZS13aWR0aFwiIDogMlxuICAgIH0pO1xuXG4gIC8vIGRpc3BsYXkgdGhlIGVxdWF0aW9uIGZvciB0aGUgbGluZSBvZiBiZXN0IGZpdFxuICB2YXIgZG9jRnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgdmFyIGVxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnUCcpO1xuICBkb2NGcmFnLmFwcGVuZENoaWxkKGVxKTtcbiAgdmFyIGVxVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGB5ID0gJHtkaXlsci50aGV0YVsxXS50b1ByZWNpc2lvbigzKX14ICsgJHtkaXlsci50aGV0YVswXS50b1ByZWNpc2lvbigzKX1gKTtcbiAgZXEuYXBwZW5kQ2hpbGQoZXFUZXh0KTtcbiAgJChcIiNkaXllcXVhdGlvblwiKS5lbXB0eSgpO1xuICAkKFwiI2RpeWVxdWF0aW9uXCIpLmFwcGVuZChkb2NGcmFnKTtcblxuICB2YXIgZG9jRnJhZzIgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIHZhciBudW1JdGVycyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ1AnKTtcbiAgZG9jRnJhZzIuYXBwZW5kQ2hpbGQobnVtSXRlcnMpO1xuICB2YXIgbnVtSXRlcnNUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYG51bWJlciBvZiBpdGVyYXRpb25zOiAke2RpeWxyLml0ZXJhdGlvbnN9YCk7XG4gIG51bUl0ZXJzLmFwcGVuZENoaWxkKG51bUl0ZXJzVGV4dCk7XG4gICQoXCIjbnVtLWl0ZXJzXCIpLmVtcHR5KCk7XG4gICQoXCIjbnVtLWl0ZXJzXCIpLmFwcGVuZChkb2NGcmFnMik7XG59O1xuZGl5YnVja2V0LnVwZGF0ZSgpO1xuXG4vLyBhZGRzIGEgbmV3LCByYW5kb21seSBnZW5lcmF0ZWQgZGF0dW0gdG8gZ3JhcGhcbmQzLnNlbGVjdChcIiNkaXlhZGRcIilcbiAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5ld0RvdCA9IHt9O1xuICAgIG5ld0RvdC54ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKTtcbiAgICBuZXdEb3QueSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCk7XG4gICAgZGl5YnVja2V0LmRhdGEucHVzaChuZXdEb3QpO1xuICAgIGRpeWJ1Y2tldC51cGRhdGUoKTtcbiAgfSk7XG5cbiQoJyNkaXl2YWxzJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKCkge1xuICBkaXlsci50aGV0YVswXSA9ICQoJyNkaXl2YWxzIGlucHV0Om50aC1jaGlsZCgxKScpLnZhbCgpO1xuICBkaXlsci50aGV0YVsxXSA9ICQoJyNkaXl2YWxzIGlucHV0Om50aC1jaGlsZCgyKScpLnZhbCgpO1xuICBkaXlsci5hbHBoYSA9ICQoJyNkaXl2YWxzIGlucHV0Om50aC1jaGlsZCgzKScpLnZhbCgpO1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBkaXlidWNrZXQudXBkYXRlKCk7XG59KTtcbiJdfQ==
