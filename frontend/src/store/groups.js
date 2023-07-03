import { csrfFetch } from "./csrf";





// ===========thunks================






// get all groups
export const thunkGetGroups = () => async (dispatch) => {
    const response = await csrfFetch("/api/groups");
    const data = await response.json();
    dispatch(setGroups(data.Groups));
    return response;
  };







// types
const SET_GROUPS = "Groups/setGroups";

//actins
const setGroups = (Groups) => {
    return {
        type: SET_GROUPS,
        payload: Groups,
    };
};
const groupsReducer = (state = [], action) => {
    let groups;
    switch (action.type) {
        case SET_GROUPS:

           let groups= action.payload;
            return groups;

        default:
            return state;
    }
};


export default groupsReducer
