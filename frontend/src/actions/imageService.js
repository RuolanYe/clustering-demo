import axios from 'axios';

let url = 'http://localhost:8000/api/images/';
//GET LEADS
export const getImages = async () => {

    const response = await axios.get(url)
    // console.log('service')
    // console.log(response)
    
    return response.data
}

// //delete lead
// const deleteLead = async (leadId) => {
//     // const config ={
//     //     headers:{
//     //         Authorization: `Bearer ${token}`
//     //     }
//     // }
//     const response = await axios.delete("/api/leads/" + leadId)
    
//     // return response.data
//     return response
// }


// create lead
const createImage = async (imageData) => {
    // const config ={
    //     headers:{
    //         Authorization: `Bearer ${token}`
    //     }
    // }
    // const x = Math.random() * 100;
    // const y = Math.random() * 100;
    // const cluster = 0;

    // if (x<=50){
    //     if (y<=50){
    //         cluster = 1;
    //     }
    //     else{
    //         cluster = 2;
    //     }   
    // }
    // else{
    //     cluster = 3;
    // }

    // imageData.append('x', x);
    // imageData.append('y', y);
    // imageData.append('cluster', cluster);

    const response = await axios.post(url, imageData, {headers: {'content-type': 'multipart/form-data'}})
    // console.log('service')
    // console.log(leadData)
    // console.log(response)
    return response
}

const imageService = {
    getImages,
    // deleteLead,
    createImage, 
}

export default imageService