import React ,{ Component, useEffect, useState } from 'react'
import axios from 'axios'
import {useSelector, useDispatch} from 'react-redux'
import { getImages, createImage } from '../reducers/imagesSlice';

function Dashboard() {
    const dispatch = useDispatch()
    const imageList = useSelector((state) => state.imagesSlice.images)
    // console.log(imageList)

    const [state, setState] = useState({
        title: '',
        image: null
    });

    useEffect(() => {

        dispatch(getImages())

      }, [dispatch])


    
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
    <div className="App">
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
        <div>         
          {imageList.map((Img) => (
            <img src={'http://localhost:8000'+Img.image} />      
          ))}
        </div>
        
      </div>
  )
}

export default Dashboard