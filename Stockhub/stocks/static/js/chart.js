function calenderchart(){
    

console.log("chart");

var width = 960,
    height = 136,
    cellSize = 17; // cell size
var percent = d3.format(".1%"),
    format = d3.timeFormat("%Y-%m-%d");
var color = d3.scaleQuantize()
    .domain([-.05, .05])
    .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));
var svg = d3.select("#calendar").selectAll("svg")
    .data(d3.range(2019, 2020))
  .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "RdYlGn")
  .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");
svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d; });
var rect = svg.selectAll(".day")
    .data(function(d) { return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d),d) * cellSize; })
    .attr("y", function(d) { return d.getDay() * cellSize; })
    .datum(format);
rect.append("title")
    .text(function(d) { return d; });
svg.selectAll(".month")
    .data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("path")
    .attr("class", "month")
    .attr("d", monthPath);
//d3.json("api/markets", function(error, csv) {
d3.json("api/markets").then(function(csv) {
  //if (error) throw error;
    var data = d3.nest()
    
    .key(function(d) { return d.date; })
        .rollup(function (d) {
            return (d[0].close - d[0].open) / d[0].open;
        })
    .map(csv);
    console.log("chart");
    console.log(csv);
    console.log(data);
    

    rect
        .filter(function (d) {
            return data.has(d);
        })
        .attr("class", function (d) {
            return "day " + color(data.get(d));
        })
    .select("title")
        .text(function (d) {
            return d + ": " + percent(data.get(d));
        });
});
function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0),t0),
      d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1),t1);
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
}


}
function calenderv() {
 function drawCalendar(dateData){

    var weeksInMonth = function(month){
      var m = d3.timeMonth.floor(month)
      return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
    }
  
    var minDate = d3.min(dateData, function(d) { return new Date(d.day) })
    var maxDate = d3.max(dateData, function(d) { return new Date(d.day) })
  
    var cellMargin = 2,
        cellSize = 20;
  
    var day = d3.timeFormat("%w"),
        week = d3.timeFormat("%U"),
        format = d3.timeFormat("%Y-%m-%d"),
        titleFormat = d3.utcFormat("%a, %d-%b");
        monthName = d3.timeFormat("%B"),
        months= d3.timeMonth.range(d3.timeMonth.floor(minDate), maxDate);
  
    var svg = d3.select("#calendar").selectAll("svg")
      .data(months)
      .enter().append("svg")
      .attr("class", "month")
      .attr("height", ((cellSize * 7) + (cellMargin * 8) + 20) ) // the 20 is for the month labels
      .attr("width", function(d) {
        var columns = weeksInMonth(d);
        return ((cellSize * columns) + (cellMargin * (columns + 1)));
      })
      .append("g")
  
    svg.append("text")
      .attr("class", "month-name")
      .attr("y", (cellSize * 7) + (cellMargin * 8) + 15 )
      .attr("x", function(d) {
        var columns = weeksInMonth(d);
        return (((cellSize * columns) + (cellMargin * (columns + 1))) / 2);
      })
      .attr("text-anchor", "middle")
      .text(function(d) { return monthName(d); })
  
    var rect = svg.selectAll("rect.day")
      .data(function(d, i) { return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1)); })
      .enter().append("rect")
      .attr("class", "day")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("rx", 3).attr("ry", 3) // rounded corners
      .attr("fill", '#eaeaea') // default light grey fill
      .attr("y", function(d) { return (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin; })
      .attr("x", function(d) { return ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) + ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) + cellMargin ; })
      .on("mouseover", function(d) {
        d3.select(this).classed('hover', true);
      })
      .on("mouseout", function(d) {
        d3.select(this).classed('hover', false);
      })
      .datum(format);
  
    rect.append("title")
      .text(function(d) { return titleFormat(new Date(d)); });
  
    var lookup = d3.nest()
      .key(function(d) { return d.day; })
      .rollup(function(leaves) {
        return d3.sum(leaves, function(d){ return parseInt(d.count); });
      })
      .object(dateData);
  
    var scale = d3.scaleLinear()
      .domain(d3.extent(dateData, function(d) { return parseInt(d.count); }))
      .range([0.4,1]); // the interpolate used for color expects a number in the range [0,1] but i don't want the lightest part of the color scheme
  
    rect.filter(function(d) { return d in lookup; })
      .style("fill", function(d) { return d3.interpolatePuBu(scale(lookup[d])); })
      .select("title")
      .text(function(d) { return titleFormat(new Date(d)) + ":  " + lookup[d]; });
  
  }
  
  d3.json("api/markets", function(response){
    drawCalendar(response);
  })
}
//d3.select("#calView").on("click",calenderchart);
calenderchart()