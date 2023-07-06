import { csrfFetch } from "./csrf";





// ===========thunks================






// get all groups
export const thunkGetEventsByGroup = (id) => async (dispatch) => {

    const response = await csrfFetch(`/api/groups/${id}/events`);
    const data = await response.json();

    dispatch(getGroupEvents(data.Events));
    return response;
};



export const thunkGetEvents = () => async (dispatch) => {
    const response = await csrfFetch('/api/events')
    const data = await response.json(  )
    dispatch(getAllEvents(data.Events))
    return response
}





// types
const GET_GROUP_EVENTS = "EVENTS/GetGroupEvents";
const GET_ALL_EVENTS = 'EVENTS/getAllEvents'
//actins
const getGroupEvents = (eventsData) => {
    return {
        type: GET_GROUP_EVENTS,
        eventsData,
    };
};

const getAllEvents = (eventsData) => {
    return{
        type: GET_ALL_EVENTS,
        eventsData,
    }
}

const initialState = {
    allEvents: {},
    singleGroupEvents: {},
}

const eventsReducer = (state = initialState, action) => {
    let newEvents;
    switch (action.type) {
        case GET_ALL_EVENTS:
            let newEventsState = Object.assign({}, state)

            console.log("reducer", action.eventsData)
            action.eventsData.forEach((event) => {

                newEventsState.allEvents[event.id] = event
            });

            return newEventsState;
        default:
            return state;
    }
};


export default eventsReducer
