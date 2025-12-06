export default function AreaChart(container) {
  const margin = ({ top: 30, right: 30, bottom: 60, left: 60 });

  const width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  const svg = d3
    .selectAll(container)
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xScale = d3.scaleTime().range([0, width]);

  const yScale = d3.scaleLinear().range([height, 0]);

  // create path
  svg.append("path").attr("class", "chart");

  const xAxis = d3.axisBottom().scale(xScale);

  const yAxis = d3.axisLeft().scale(yScale);

  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${height})`);

  svg
    .append("g")
    .attr("class", "axis y-axis");
  
  const brush = d3.brushX().extent([[0, 0], [width, height]]).on("brush", brushed).on("end", brushend);
  
  svg.append("g").attr('class', 'brush').call(brush);

  function brushed({selection}) {
    console.log("selection", selection);
    if (selection) { 
      console.log("brush", selection.map(xScale.invert))
      listeners["brushed"](selection.map(xScale.invert));
    }
  }
  
  function brushend({selection}) {
    if (!selection) {
      svg.select(".brush").call(brush.move, xScale.range());
    }
  }
  
  const listeners = {brushed: null}
  
  function update(data) {
    xScale.domain([d3.min(data, d => d.date), d3.max(data, d => d.date)]);
    yScale.domain([0, d3.max(data, d => d["Data Rates Total"])]);
    
    const area = d3.area().x(d => xScale(d.date)).y1(d => yScale(d["Data Rates Total"])).y0(yScale(0));
    
    svg.select(".chart").datum(data).style("fill", "#8f8e8d").attr("d", area);
    
    const xAxis = d3.axisBottom().scale(xScale);
    const yAxis = d3.axisLeft().scale(yScale);  
    
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
      .text("Total Reported Offenses (Per 100,000 Population)");
    
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
  
  function on(event, listener) {
    listeners[event] = listener;
  }
  
  return {
    update,
    on
  };

}