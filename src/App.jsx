import './App.css'
import { useState, useRef, useEffect } from 'react'
import * as d3 from 'd3'


function App() {
  const svgRef = useRef();
  const [data, setData] = useState(null);
   
  useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json');
      if (response.ok) {
        const data = await response.json();
          setData(data);
          console.log(data);
      }
    } catch (error) {
      console.error('There was an error: ', error);
    }
  }
  fetchData();
  }, [])

  useEffect(() => {
   if (!data) return;

   const width = 900;
   const height = 550;
   const margin = { top: 40, right: 60, bottom: 60, left: 90 }

   const svg = d3.select(svgRef.current)
   .attr('width', width)
   .attr('height', height)
   .style('outline', '1px solid black')

   const tooltip = d3.select('body')
   .append('div')
   .attr('id', 'tooltip')
   .style('opacity', 0)
   .style('position', 'absolute')
   .style('background-color', 'lightblue')
   .style('padding', '10px')
   .style('border', '1px solid #ccc')
   .style('pointer-events', 'none');

   const xScale = d3.scaleTime()
   .domain([d3.min(data, d => new Date(d.Year - 1, 0)), d3.max(data, d => new Date(d.Year + 1, 0))])
   .range([margin.left, width - margin.right])

   const parseTime = (timeStr) => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return Number(minutes) * 60 + Number(seconds);
   }
   
   const yScale = d3.scaleLinear()
   .domain([parseTime("36:00"), parseTime("40:00")])
   .range([margin.top, height - margin.bottom])

   const xAxis = d3.axisBottom(xScale)
    .ticks(10)
    .tickFormat(d3.timeFormat('%Y'))
  
    const yAxis = d3.axisLeft(yScale)
    .tickFormat(seconds => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    })
   
    svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(xAxis)

    svg.append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(yAxis)

    svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', (d) => d.Doping ? 'dot doping' : 'dot not-doping')
    .attr('data-xvalue', d => d.Year)
    .attr('data-yvalue', d => {
        const date = new Date(Date.UTC(1970, 0, 1)); 
        const [mins, secs] = d.Time.split(':').map(Number);
        
        date.setUTCHours(0);
        date.setUTCMinutes(mins);
        date.setUTCSeconds(secs);
        date.setUTCMilliseconds(0);
        
        return date;
    })
    .on('mouseover', (event, d) => {
      tooltip
         .transition()
         .duration(200)
         .style('opacity', 0.9);
      tooltip
         .html(`${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}${d.Doping ? '<br><br>' + d.Doping : ''}`)
         .attr('data-year', d.Year)
         .style('left', `${event.pageX + 10}px`)
         .style('top', `${event.pageY - 28}px`);
    })
    .on('mouseout', () => {
      tooltip
      .transition()
      .duration(200)
      .style('opacity', 0)
    })


    .attr('cx', d => xScale(new Date(d.Year, 0)))
    .attr('cy', d => yScale(parseTime(d.Time)))
    .attr('r', 5)

    svg.append('text')
    .attr('x', width / 2)
    .attr('y', margin.top)
    .attr('text-anchor', 'middle')
    .attr('font-size', '1.5em')
    .attr('id', 'title')
    .text('Doping in Professional Bicycle Racing')
    
    svg.append('text')
    .attr('x', width / 2)
    .attr('y', margin.top + 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '0.9em')
    .attr('font-weight', '300')
    .text("35 Fastest times up Alpe d'huez")

    svg.append('text')
    .attr('x', margin.left - 40)
    .attr('y', height / 2)
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90, 40, 275)')
    .style('font-size', '1em')
    .style('font-family', 'Arial')
    .text('Time in Minutes')

    const legend = svg.append('g')
    .attr('id', 'legend')
    .attr('transform', `translate(${width - margin.right - 200}, ${height - 450})`);

    legend.append('rect')
    .attr('width', 200)
    .attr('height', 70)
    .style('fill', 'white')
    .style('stroke', 'black');

   
    legend.append('text')
    .attr('x', 10)
    .attr('y', 25)
    .attr('text-anchor', 'start')
    .style('font-size', '0.8em')
    .text('Riders with doping allegations');

    legend.append('rect')
    .attr('x', 175)
    .attr('y', 15)
    .attr('width', 15)
    .attr('height', 15)
    .style('fill', 'orange');

    legend.append('text')
    .attr('x', 10)
    .attr('y', 55)
    .text('No doping allegations')
    .attr('text-anchor', 'start')
    .style('font-size', '0.8em');

    legend.append('rect')
    .attr('x', 175)
    .attr('y', 45)
    .attr('width', 15)
    .attr('height', 15)
    .style('fill', 'blue');

  }, [data])

  return (
    <>
    <svg className="svg-container" ref={svgRef} ></svg>
    </>
  )
}

export default App
