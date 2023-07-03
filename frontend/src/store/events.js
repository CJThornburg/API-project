import { csrfFetch } from "./csrf";





// ===========thunks================






// get all groups
export const thunkGetEventsByGroup = (id) => async (dispatch) => {

    const response = await csrfFetch(`/api/groups/${id}/events`);
    const data = await response.json();
    dispatch(getGroupEvents(data.Events));
    return response;
};








// types
const GET_GROUP_EVENTS = "EVENTS/GetGroupEvents";

//actins
const getGroupEvents = (Events) => {
    return {
        type: GET_GROUP_EVENTS,
        payload: Events,
    };
};


const eventsReducer = (state = {}, action) => {
    let newEvents;
    switch (action.type) {
        case GET_GROUP_EVENTS:
            events = Object.assign({}, state);
            
            action.payload.forEach((events) => {

            })
            events.group = action.payload;
            return events;

        default:
            return state;
    }
};


export default eventsReducer
