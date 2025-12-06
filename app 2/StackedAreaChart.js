export default function StackedAreaChart(container) {
  var margin = ({ top: 30, right: 30, bottom: 20, left: 60 });

  var width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  const xScale = d3.scaleTime().range([0, width]);

  const yScale = d3.scaleLinear().range([height, 0]);

  const xAxis = d3.axisBottom().scale(xScale);

  const yAxis = d3.axisLeft().scale(yScale);
  
  const colorScale = d3.scaleOrdinal().range(d3.schemeTableau10);

  let selected = null, xDomain, data;
  
  function update(_data) {
    data = _data; 
    console.log(data);
    const keys = selected ? [selected] : data.columns.slice(0);
    const stack = d3.stack().keys(keys);
    const stackedData = stack(data);
    
    console.log(keys);
    
    removeElementsByClass("stacked-chart");
    drawStackedChart(data, keys, stackedData);
  }
  
  //function that removes an element by class
  function removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
  }
  
  //function that draws the stacked area chart
  function drawStackedChart(data, keys, stackedData) {
    
    //first add div back with class stacked-chart
    var elem = document.createElement('div'); 
    elem.setAttribute("class", "stacked-chart");
    var referenceNode = document.querySelector('#select-state');
    referenceNode.after(elem);
    
    const svg = d3
    .selectAll(container)
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${height})`);

    svg
      .append("g")
      .attr("class", "axis y-axis");
    
    svg.append("clipPath").attr("id", "clip").append("rect").attr("height", height).attr("width", width);

    xScale.domain(xDomain? xDomain: [d3.min(data, d => d.date), d3.max(data, d => d.date)]);
    
    yScale.domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))]);
    
    const area = d3.area().x(d => xScale(d.data.date)).y1(d => yScale(d[1])).y0(d => yScale(d[0]));

    const areas = svg.selectAll(".area").data(stackedData, d => d.key);
    
    areas.enter()
        .append("path")
        .attr("class", 'area')
        .attr("clip-path", "url(#clip)")
        .merge(areas)
        .style("fill", (d,i) => colorScale(d.key))
        .on("mouseenter", function(){return tooltip.style("visibility", "visible");})
        .on("mouseleave", function(){return tooltip.style("visibility", "hidden");})
        .attr("d", area).on("mouseover", (event, d, i) => {if (d.key == "Data Rates Property Burglary") {tooltip.text("Burglary Rate")}
                                                          else if (d.key == "Data Rates Property Larceny") {tooltip.text("Larceny Rate")}
                                                          else if (d.key == "Data Rates Property Motor") {tooltip.text("Motor Rate")}
                                                           else if (d.key == "Data Rates Violent Assault") {tooltip.text("Assault Rate")}
                                                           else if (d.key == "Data Rates Violent Murder") {tooltip.text("Murder Rate")}
                                                           else if (d.key == "Data Rates Violent Rape") {tooltip.text("Rape Rate")}
                                                           else if (d.key == "Data Rates Violent Robbery") {tooltip.text("Robbery Rate")}
                                                          })
        .on("mouseout", () => tooltip.text(""))
        .on("click", (event, d) => {if (selected === d.key) {selected = null;} else {selected = d.key} update(data);})
    
    const tooltip = svg.append("text")
      .attr("x", 5)
      .attr("y", 10)
      .attr("font-size", 15)
      
    areas.exit().remove();
    
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    svg.select(".x-axis").call(xAxis);
    svg.select(".y-axis").call(yAxis);
    
    svg
      .append("text")
      .attr("class", "axis-title")
      .attr("x", -50)
      .attr("y", -10)
      .attr("font-size", 15)
      .attr("dy", ".1em")
      .style("text-anchor", "start")
      .text("Reported Offenses (Per 100,000 Population)");
    
    svg
      .append("text")
      .attr("class", "axis-title")
      .attr("x", width + 30)
      .attr("y", height + 15)
      .attr("font-size", 15)
      .attr("dy", ".1em")
      .style("text-anchor", "end")
      .text("Year");
    
    
  }
  
  function filterByDate(range) {
    xDomain = range;
    update(data);
  }
  
  return {
    update,
    filterByDate
  }
}