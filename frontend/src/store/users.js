import { csrfFetch } from "./csrf";


export const thunkGetUser = (id) => async (dispatch) => {
    console.log(id)
    const response = await csrfFetch(`/api/users/${id}`)

    let data = await response.json()
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", data)
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
            console.log("!!!!!!!!!!!!!!!!", action.userData)
            const id = action.userData.id
            const prop = `user${action.userData.id}`
            newState[prop] = action.userData
            console.log("new state", newState)
            console.log("check", newState['user1'].firstName)
            return newState
            break;




        default: return state
            break;
    }
}

export default userReducer;
