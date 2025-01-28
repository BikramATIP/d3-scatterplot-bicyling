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
   const margin = { top: 30, right: 30, bottom: 30, left: 30 }

   const svg = d3.select(svgRef.current)
   .attr('width', width)
   .attr('height', height)

   const xScale = d3.scaleTime()
   .domain([d3.min(data, d => new Date(d.Year - 1, 0)), d3.max(data, d => new Date(d.Year + 1, 0))])
   .range([margin.left, width - margin.right])
   
   const yScale = d3.scaleLinear()
   .domain([d3.max(data, d => d.Place), 0])
   .range([margin.top, height - margin.bottom])

   const xAxis = d3.axisBottom(xScale)
    .ticks(10)
    .tickFormat(d3.timeFormat('%Y'))
  
    const yAxis = d3.axisLeft(yScale)
    .ticks(10)
    .tickFormat(d => `${d}.`)
   

  }, [data])



  return (
    <>
    <svg className="svg-container" ref={svgRef} ></svg>
    </>
  )
}

export default App
