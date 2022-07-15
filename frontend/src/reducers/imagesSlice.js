// import {GET_LEADS} from '../actions/types.js';
import imageService from '../actions/imageService'
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

const initialState = {
    images: []
}


//Get leads
export const getImages = createAsyncThunk('images/getAll', async (_,thunkAPI)=>{
    try{
        const response = await imageService.getImages()
        return response
    }catch (error){
        console.log(error)
    }  
})

//delete lead
// export const deleteLead = createAsyncThunk(
//     'Leads/delete',
//     async (id) => {
//         try{
//             // const token = thunkAPI.getState().auth.user.token 
//             return await leadService.deleteLead(id)
//         }catch (error){
//             console.log(error)
//         }
//     }
// )

// //Create lead
export const createImage = createAsyncThunk(
    'images/create',
    async (imageData, thunkAPI) => {
        try{
            // const token = thunkAPI.getState().auth.user.token
            
            return await imageService.createImage(imageData)
        }catch (error){
            console.log(error)
        }
    }
)

export const imagesSlice = createSlice({
    name: 'image',
    initialState,
    reducers:{
        reset: (state) => initialState,
    },
    extraReducers: (builder) =>{
        builder
        .addCase(getImages.pending,(state)=>{
            console.log('getImages pending')
        })
        .addCase(getImages.fulfilled,(state,action)=>{

            state.images = action.payload
            // console.log(action)
        })
        .addCase(getImages.rejected,(state,action)=>{
            console.log('getImages rejected')
            state.message = action.payload
        })
        // .addCase(deleteLead.pending,(state)=>{
        //     console.log('deleteLead pending')
        // })
        // .addCase(deleteLead.fulfilled,(state,action)=>{

        //     state.leads = state.leads.filter((lead) => lead.id !== action.meta.arg)

        // })
        // .addCase(deleteLead.rejected,(state,action)=>{
        //     console.log('deleteLead rejected')
        //     state.message = action.payload
        // })
        .addCase(createImage.pending,(state)=>{
            console.log('createImage pending')
        })
        .addCase(createImage.fulfilled,(state,action)=>{
            // console.log('slice')
            // console.log(state.leads)
            // console.log(action)
            state.images.push(action.payload.data)
        })
        .addCase(createImage.rejected,(state,action)=>{
            console.log('createImage rejected')
            state.message = action.payload
        })
    }
})

export const {reset} = imagesSlice.actions
export default imagesSlice.reducer