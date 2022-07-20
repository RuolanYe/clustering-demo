import axios from 'axios';

let url = 'http://localhost:8000/api/images/';
//GET IMAGES
export const getImages = async () => {

    const response = await axios.get(url)

    
    return response.data
}

// //delete image
// const deleteImage = async (imageId) => {
//     // const config ={
//     //     headers:{
//     //         Authorization: `Bearer ${token}`
//     //     }
//     // }
//     const response = await axios.delete("/api/images/" + imageId)
    
//     // return response.data
//     return response
// }


// create image
const createImage = async (imageData) => {
    // const config ={
    //     headers:{
    //         Authorization: `Bearer ${token}`
    //     }
    // }

    const response = await axios.post(url, imageData, {headers: {'content-type': 'multipart/form-data'}})
    return response
}

const imageService = {
    getImages,
    // deleteImage,
    createImage, 
}

export default imageService