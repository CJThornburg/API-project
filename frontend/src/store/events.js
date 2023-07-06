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
    const data = await response.json()
    dispatch(getAllEvents(data.Events))
    return response
}


/*
signle event pull
eventid/attendance  find attending marked as host
*/



export const thunkGetEvent = (id) => async (dispatch) => {
    console.log("in start of getventthunk =>", "eventid", id, "!!!!!!!!!!!!!!!!!!!!!!!")
    const response = await csrfFetch(`/api/events/${id}`);

    const data = await response.json();

    console.log("after first fetch", data, "!!!!!!!!!!!!!!!!!!!!!!!")

    const response2 = await csrfFetch(`/api/events/${id}/attendees/`);

    const attendance = await response2.json();
    data.attendance = attendance
    console.log("after second fetch", data)



    dispatch(getEvent(data));
    return response;
};


// types
const GET_GROUP_EVENTS = "EVENTS/GetGroupEvents";
const GET_ALL_EVENTS = 'EVENTS/getAllEvents'
const GET_EVENT = 'EVENTS/getEvent'
//actins
const getGroupEvents = (eventsData) => {
    return {
        type: GET_GROUP_EVENTS,
        eventsData,
    };
};

const getAllEvents = (eventsData) => {
    return {
        type: GET_ALL_EVENTS,
        eventsData,
    }
}

const getEvent = (eventData) => {
    return {
        type: GET_EVENT,
        eventData
    }
}

const initialState = {
    allEvents: {},
    singleGroupEvents: {},
    singleEvent: {}
}

const eventsReducer = (state = initialState, action) => {

    switch (action.type) {
        case GET_ALL_EVENTS:
            let newEventsState = Object.assign({}, state)

            action.eventsData.forEach((event) => {

                newEventsState.allEvents[event.id] = event
            });

            return newEventsState;


        case GET_EVENT:
            console.log("in reducer", action.eventData)
            console.log("reducer", action.eventData)
            let stateReset = Object.assign({}, state)
            stateReset.singleEvent = action.eventData


            console.log("right before setting state in reducer")
            return stateReset
        default:
            return state;
    }
};


export default eventsReducer
