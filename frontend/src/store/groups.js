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
const setGroups = (groupData) => {
    return {
        type: SET_GROUPS,
        groupData,
    };
};


const initialState = {
    allGroups: {},
    singleGroup: {},
    eventsByGroup:{}
}

// state will be saved to state.groups
const groupsReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_GROUPS:
            let newState = Object.assign({}, state)

            action.groupData.forEach((group) => {

                newState.allGroups[group.id] = group
            });

            return newState;

        default:
            return state;
    }
};


export default groupsReducer
