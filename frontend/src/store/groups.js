import { csrfFetch } from "./csrf";





// ===========thunks================






// get all groups
export const thunkGetGroups = () => async (dispatch) => {
    const response = await csrfFetch("/api/groups");
    const data = await response.json();
    dispatch(setGroups(data.Groups));
    return response;
};


export const thunkGetEventsByGroup = (id) => async (dispatch) => {

    const response = await csrfFetch(`/api/groups/${id}/events`);
    let data = await response.json();
    console.log("hiiiiiiii", id)
    // let eventsObj
    // if (id) {
    //     eventsObj['id'] = id
    // }

    // // eventsObj['id'] = id
    // console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiii", eventsObj)
    // eventsObj['data'] = data
    dispatch(getGroupEvents({ ...data, id: id }));
    return response;
};




// types
const SET_GROUPS = "Groups/setGroups";
const GET_GROUP_EVENTS = "EVENTS/GetGroupEvents";
//actins
const setGroups = (groupData) => {
    return {
        type: SET_GROUPS,
        groupData,
    };
};


const getGroupEvents = (eventsData) => {
    return {
        type: GET_GROUP_EVENTS,
        eventsData,
    };
};



const initialState = {
    allGroups: {},
    singleGroup: {},
    eventsByGroup: {}
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

        case GET_GROUP_EVENTS:
            let newStateEvents = Object.assign({}, state)
            console.log("hi in get group", action.eventsData.id)

            let currentId = action.eventsData.id
            newStateEvents.allGroups[currentId][`events`] = action.eventsData.Events

            // action.payload.forEach((eventsData) => {

            // })
            // events.group = action.payload;
            // return eventsData;
            return newStateEvents

        default:
            return state;
    }
};


export default groupsReducer
