import React ,{ useRef, useEffect, useState } from 'react'
import axios from 'axios'
import {useSelector, useDispatch} from 'react-redux'
import { getImages, createImage } from '../reducers/imagesSlice';
import * as d3 from 'd3'
import {hierarchy} from 'd3-hierarchy'

function Dashboard() {
  //get image list from redux state
    const dispatch = useDispatch()
    const imageList = useSelector((state) => state.imagesSlice.images)
    
    useEffect(() => {

      dispatch(getImages())

    }, [dispatch])

 
    

    // data[1].children.push({name:'12314', image:'http://127.0.0.1:8000/media/post_images/Picture2.png'})
    // imageList.map((Img) => {
    //   data.children[Img.cluster-1].children.push({name:Img.title, image:'http://localhost:8000'+Img.image})
    // })

    // const dogsHierarchy = hierarchy(data).sum(()=>1)
    // const createPack = pack().size([500,500])
    // const dogsPack = createPack(dogsHierarchy)
    // console.log(dogsPack)
    
    const svgRef=useRef()
    const data={name:'dogs',children:[]}
    data.children.push({name:'1',children:[]},
                        {name:'2',children:[]},
                        {name:'3',children:[]})

     //d3 plots
    useEffect(() => {
      // update data 
      imageList.map((Img) => {
        data.children[Img.cluster-1].children.push({name:Img.title, image:'http://localhost:8000'+Img.image})
      })

      const width = 932;
      const height = 932;
      const pack = data => d3.pack()
        .size([width, height])
        .padding(3)
        (d3.hierarchy(data)
          .sum(()=>1)
          // .sum(d => d.value)
          // .sort((a, b) => b.value - a.value)
          )
      
      const color = d3.scaleLinear()
          .domain([0, 5])
          .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
          .interpolate(d3.interpolateHcl)

      const root = pack(data);
      // console.log(root)
      let focus = root;
      let view;
      

      const svg=d3.select(svgRef.current)
      // const svg = d3.create("svg")
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .style("display", "block")
        .style("margin", "0 -14px")
        .style("background", color(0))
        .style("cursor", "pointer")
        .on("click", (event) => zoom(event, root));
      
      //refresh
      svg.selectAll("*").remove();
      
      const node = svg.append("g")
        .selectAll("circle")
        .data(root.descendants().slice(1))
        .join("circle")
          .attr("fill", d => d.children ? color(d.depth) : "white")
          .attr("pointer-events", d => !d.children ? "none" : null)
          .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
          .on("mouseout", function() { d3.select(this).attr("stroke", null); })
          .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

      const label = svg.append("g")
          .style("font", "10px sans-serif")
          .attr("pointer-events", "none")
          .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
          .style("fill-opacity", d => d.parent === root ? 1 : 0)
          .style("display", d => d.parent === root ? "inline" : "none")
          .text(d => d.data.name);
          
      zoomTo([root.x, root.y, root.r * 2]);
      
      function zoomTo(v) {
        const k = width / v[2];
    
        view = v;

        // console.log(v)
    
        label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("r", d => d.r * k);
      }

      function zoom(event, d) {
        // const focus0 = focus;
    
        focus = d;
    
        const transition = svg.transition()
            .duration(event.altKey ? 7500 : 750)
            .tween("zoom", d => {
              const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
              return t => zoomTo(i(t));
            });
    
        label
          .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
          .transition(transition)
            .style("fill-opacity", d => d.parent === focus ? 1 : 0)
            .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
            .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
      }
      
    }, [imageList])



    //create state to store data from input form
    const [state, setState] = useState({
        title: '',
        image: null
    });

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.id]: e.target.value
        })
      };
    
    const handleImageChange = (e) => {
        setState({
            ...state,
            image: e.target.files[0]
        })
      };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(state);
        let form_data = new FormData();
        form_data.append('image', state.image, state.image.name);
        form_data.append('title', state.title);
        // let url = 'http://localhost:8000/api/images/';
        // axios.post(url, form_data, {
        //   headers: {
        //     'content-type': 'multipart/form-data'
        //   }
        // })
        //     .then(res => {
        //       console.log(res.data);
        //     })
        //     .catch(err => console.log(err))
      
        dispatch(createImage(form_data))
        setState({title: ''});
        // this.setState({image: ''});
      };


  return (
    <div className="Dashboard">
        <form onSubmit={handleSubmit}>
          <p>
            <input type="text" placeholder='Title' id='title' value={state.title} onChange={handleChange} required/>
          </p>
          <p>
            <input type="file"
                   id="image"
                   accept="image/png, image/jpeg"  onChange={handleImageChange} required/>
          </p>
          <input type="submit"/>
        </form>
        {/* <svg width='500' height='500'>
          {dogsPack.descendants().map(({x,y,r})=>(<circle cx={x} cy={y} r={r} fill='transparent' stroke='black'/>))}
        </svg> */}
        {/* <div>         
          {imageList.map((Img) => (
            <img src={'http://localhost:8000'+Img.image} />      
          ))}
        </div> */}
        <svg ref={svgRef}></svg>
        {/* <svg/> */}
    </div>
  )
}

export default Dashboard