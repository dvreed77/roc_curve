var margin = {top: 20, right: 20, bottom: 50, left: 50},
    width = 200 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;

data.forEach(function(d, i){
	d.index = i;
});

R = roc(data);

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(5)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(5)
    .orient("left");

var area = d3.svg.area()
    .x(function(d) { return x(d.x); })
    .y0(height)
    .y1(function(d) { return y(d.y); });

var svg = d3.select("#roc").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain([0, 1]);
y.domain([0, 1]);

svg.append("path")
  .datum(R)
  .attr("class", "area")
  .attr("d", area)

var circs = svg.selectAll("circle")
.data(R)
.enter()
.append("circle")
.attr("cx", function(d) {return x(d.x);})
.attr("cy", function(d) {return y(d.y);})
.attr("r", 3)
.attr("class", "pt")
.on("mouseover", mouseover)
    .on("mouseout", mouseout);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("TPR");

// var cols = d3.select('#chart').append("ul")

var cols = d3.select('#chart table').selectAll("tr.data")
.data(data)
.enter()
.append("tr")
.html(function(d){return "<td>"+d.class+"</td><td>" + d.score + "</td>";})
.on("mouseover", mouseover1)
    .on("mouseout", mouseout1);
// .text(function(d){return d.score;})

// Toggle children on click.
function mouseover(d) {
  cols[0][d.index].className = "select";
  d3.select(this).attr("r", 5)
}
function mouseout(d) {
  cols[0][d.index].className = "";
  d3.select(this).attr("r", 3)
}

// Toggle children on click.
function mouseover1(d) {
  d3.select(circs[0][d.index]).attr("r", 5);
  d3.select(this).attr("class", "select")
}
function mouseout1(d) {
  d3.select(circs[0][d.index]).attr("r", 3);
  d3.select(this).attr("class", "")
}


function roc(data) {

// Sort data by score, ascending
data.sort(function(a,b){return b.score-a.score});

R = [];

num_pts = data.length;

N = data.filter(function(a){return a.class == 0;}).length;
P = num_pts - N;

// console.log(data)
var i = 1;

f_prev = -10;

var FP = 0,
TP = 0;

// console.log(data[i])
// data[0].x = 0;
// data[0].y = 0;
while (i < num_pts) {

	// console.log(data[i])
	if (data[i].score != f_prev) {
		data[i-1].x = FP/N;
		data[i-1].y = TP/P + .1;
		f_prev = data[i].score;
	}

	if (data[i].class == 1) {
		TP = TP + 1;
	}
	else {
		FP = FP + 1
	}

	i++;
}

//TODO +0.1 is a hack
data[num_pts-1].x = FP/N;
data[num_pts-1].y = TP/P + 0.1;

return data;
	
}