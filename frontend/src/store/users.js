import { csrfFetch } from "./csrf";


export const thunkGetUser = (id) => async (dispatch) => {

    const response = await csrfFetch(`/api/users/${id}`)

    let data = await response.json()

    dispatch(getUser(data))

    return response
}


// types
const GET_USER = 'Users/getUser'


const getUser = (userData) => {
    return {
        type: GET_USER,
        userData
    }
}


const initialState = {

}


const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USER:
            let newState = { ...state }
          ("!!!!!!!!!!!!!!!!", action.userData)
            const id = action.userData.id
            const prop = `user${action.userData.id}`
            newState[prop] = action.userData
           
            return newState
            break;




        default: return state
            break;
    }
}

export default userReducer;
