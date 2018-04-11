var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

d3.csv("marvel_cluster_no_OL.csv", function(err, data) {
    if (err) {
        throw err;
    }

    data.forEach(function(d) {
        d.x = +d.x;
        d.y = +d.y
    });


    // Create scale functions
    var yLinearScale = d3.scaleLinear()
        .range([height, 0]);

    var xLinearScale = d3.scaleLinear()
        .range([0, width]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Scale the domain
    xLinearScale.domain([-0.6, d3.max(data, function(d) {
        return +d.x;
    })]);
    yLinearScale.domain([-0.8, d3.max(data, function(d) {
        return +d.y;
    })]);

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .attr("style", "background-color: #8bd3fb")
        .offset([85, 80])
        .html(function(d) {
            var hero = d.heroes;
            var num_comics = +d.size;
            return ("<b> Marvel Character: " + hero + "<br> <b> Number of Comics: " + num_comics);
        });

    chart.call(toolTip);
    
    var colorCircles = d3.scaleOrdinal(d3.schemeCategory10);


    var scaleRadius = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return +d.size; }), 
        d3.max(data, function(d) { return +d.size; })])
        .range([2,25]);

    chart.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d, index) {
            return xLinearScale(d.x);
        })
        .attr("cy", function(d, index) {
            return yLinearScale(d.y);
        })
        .attr('r', function(d) { return scaleRadius(d.size)*2})
        .style("fill", function(d) {return colorCircles(d.label)})
        .style("opacity", 0.6)
        .on("mouseover", toolTip.show)
        .on("mouseout", toolTip.hide);

    chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chart.append("g")
        .call(leftAxis);

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")

    // Append x-axis labels
    chart.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
});


