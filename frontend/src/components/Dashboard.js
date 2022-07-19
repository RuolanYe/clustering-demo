import React ,{ useRef, useEffect, useState } from 'react'
import axios from 'axios'
import {useSelector, useDispatch} from 'react-redux'
import { getImages, createImage } from '../reducers/imagesSlice';
import * as d3 from 'd3'
import {hierarchy} from 'd3-hierarchy'
import './bootstrap.css'
import legend from 'react'

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
    const classes = []

    classes.map((c)=>{
      data.children.push({name:c,children:[]})
    })

     //d3 plots
    useEffect(() => {
      // update data 
      imageList.map((Img) => {
        // console.log(Img)
        // console.log(classes.indexOf(Img.cluster.toString()))
        // data.children[classes.indexOf(Img.cluster)]
        if(classes.indexOf(Img.cluster)<0){
          var class_name=Img.cluster
          classes.push(class_name)
          data.children.push({name:class_name,children:[]})
        }
        data.children[classes.indexOf(Img.cluster)].children.push({name:Img.title, image:'http://localhost:8000'+Img.image})
        
      })
      // console.log(classes)
      // console.log(data)

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
      
      // const color = d3.scaleLinear()
      //     .domain([0, 5])
      //     .range(["hsl(160,80%,80%)", "hsl(250,30%,40%)"])
      //     .interpolate(d3.interpolateHcl)
      const color = ["#89b4e4","#b79ef2","#746281","#cd88a8","#faa5b7","#efc182","#fab78a","#81b071","#87c9b5","#ac8eba"]

      const root = pack(data);
      // console.log(root)
      let focus = root;
      let view;
      

      const svg=d3.select(svgRef.current)
      // const svg = d3.create("svg")
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .style("display", "block")
        .style("margin", "0 -14px")
        .style("background", "white")
        .style("cursor", "pointer")
        .on("click", (event) => zoom(event, root));
      
      //refresh
      svg.selectAll("*").remove();
      
      var defs = svg.append("defs")
      defs.append("pattern")
        .attr("id","test-image")
        .attr("height","100%")
        .attr("width","100%")
        .attr("patternContentUnits","objectBoundingBox")
        .append("image")
        .attr("height",1)
        .attr("width",1)
        .attr("preserveAspectRatio","none")
        // .attr("xlink:href","http://127.0.0.1:8000/media/post_images/Picture1_ZzTRote.png")

        defs.selectAll(".dogs-pattern")
        .data(root.descendants().slice(1))
        .enter().append("pattern")
        .attr("class","dogs-pattern")
        .attr("id",d =>d.data.name)
        .attr("height","100%")
        .attr("width","100%")
        .attr("patternContentUnits","objectBoundingBox")
        .append("image")
        .attr("height",1)
        .attr("width",1)
        .attr("preserveAspectRatio","none")
        .attr("xlink:href",d => d.data.image)
      

      const node = svg.append("g")
        .selectAll("circle")
        .data(root.descendants().slice(1))
        .join("circle")
          // .attr("fill", d => d.children ? color(d.depth) : "url(#"+d.data.name+")")
          .attr("fill", d => d.children ? color[classes.indexOf(d.data.name)%10] : "url(#"+d.data.name+")")
          .attr("pointer-events", d => !d.children ? "none" : null)
          .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
          .on("mouseout", function() { d3.select(this).attr("stroke", null); })
          .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

      

      const label = svg.append("g")
          .style("font", "20px sans-serif")
          .attr("pointer-events", "none")
          .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
          .style("fill-opacity", d => d.parent === root ? 1 : 0)
          .style("display", d => d.parent === root ? "inline" : "none")
          .text((d) => {
            // console.log(d)
            return d.data.name
          });
          
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
      };


  return (<>
    {/* <div className="card"> */}
      <h1>Dogs Classification Demo</h1>
      <br/>
      <h5>Welcome to the Dogs Classification Project! You can supply a dog image, and the system can identify the breed of the input. The classification model is trained with dog images from 120 breeds, and adopts pretrained <a href='https://arxiv.org/abs/1512.03385?context=cs'>ResNet-18</a> as feature extractor. We also generate a bubble plot below built with <a href="https://d3js.org/">D3.js</a> to visualize the results.</h5>
      <h5><strong>Please upload an image of any dogs to try out!</strong></h5>
      <br/>
      <div className="card border-primary mb-3">
        <form onSubmit={handleSubmit}>
          <fieldset>
            <div className="card-header">Upload Image</div>
            <div className="form-group">
              <label className="form-label mt-4">Image name</label>
              <input className="form-control" type="text" placeholder='Enter image name' id='title' value={state.title} onChange={handleChange} required/>
            </div>
            <div className="form-group">
              <label className="form-label mt-4">Choose image</label>
                <input className="form-control"
                      type="file"
                      id="image"
                      accept="image/png, image/jpeg"  onChange={handleImageChange} required/>
            </div>
            <div className="form-group">
              <br/>
              <button type="submit" className="btn btn-primary">Upload</button>
            </div>
          </fieldset>
        </form> 
      </div>
    {/* </div> */}
        <div display="flex" align-items="center" justify-content="center">
        {/* <container display="flex" justify-content="center" > */}
          <svg ref={svgRef}></svg>
        {/* </container> */}
        </div>
        {/* <svg/> */}
    
    </>
  )
}

export default Dashboard