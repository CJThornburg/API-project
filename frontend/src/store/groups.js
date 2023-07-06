import { csrfFetch } from "./csrf";





// ===========thunks================






// get all groups
export const thunkGetGroups = () => async (dispatch) => {
    const response = await csrfFetch("/api/groups");
    const data = await response.json();
    dispatch(getGroups(data.Groups));
    return response;
};


export const thunkGetGroup = (id) => async (dispatch) => {

    const response = await csrfFetch(`/api/groups/${id}`);

    const data = await response.json();

    const response2 = await csrfFetch(`/api/groups/${data.id}/events`);

    const events = await response2.json();

    data.events = events.Events



    dispatch(getGroup(data));
    return response;
};


export const thunkGetEventsByGroup = (id) => async (dispatch) => {

    const response = await csrfFetch(`/api/groups/${id}/events`);
    let data = await response.json();

    dispatch(getGroupEvents({ ...data, id: id }));
    return response;
};



// create group
export const thunkCreateGroup = (formData) => async (dispatch) => {
    const { name, about, type,city, state } = formData;
    const response = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify({
           name, about ,type, city, state, private : formData.private
        }),
    });
    const data = await response.json();
    // dispatch(setUser(data.user));
    return response;
};











// types
const GET_GROUPS = "Groups/getGroups";
const GET_GROUP = "Groups/getGroup";
const GET_GROUP_EVENTS = "EVENTS/GetGroupEvents";
//actins
const getGroups = (groupsData) => {
    return {
        type: GET_GROUPS,
        groupsData,
    };
};


const getGroup = (groupData) => {
    return {
        type: GET_GROUP,
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

}

// state will be saved to state.groups
const groupsReducer = (state = initialState, action) => {

    switch (action.type) {
        case GET_GROUPS:
            let newGroupsState = Object.assign({}, state)

            action.groupsData.forEach((group) => {

                newGroupsState.allGroups[group.id] = group
            });

            return newGroupsState;

        case GET_GROUP:

            let stateReset = Object.assign({}, state)
            stateReset.singleGroup = action.groupData



            return stateReset

        case GET_GROUP_EVENTS:
            let newStateEvents = Object.assign({}, state)


            let currentId = action.eventsData.id


            newStateEvents.allGroups[currentId][`events`] = action.eventsData

            return newStateEvents

        default:
            return state;
    }
};


export default groupsReducer
