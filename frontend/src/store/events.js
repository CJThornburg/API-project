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
const getGroupEvents = (eventsData) => {
    return {
        type: GET_GROUP_EVENTS,
        eventsData,
    };
};


const initialState = {
    eventsGroup: {},

}

const eventsReducer = (state = initialState, action) => {
    let newEvents;
    switch (action.type) {
        case GET_GROUP_EVENTS:
        // newEvents = Object.assign({}, state);

        // action.payload.forEach((eventsData) => {

        // })
        // events.group = action.payload;
        // return eventsData;

        default:
            return state;
    }
};


export default eventsReducer
