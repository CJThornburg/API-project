
import { csrfFetch } from "./csrf";





// ===========thunks================







export const thunkDeleteEvent = (id) => async (dispatch) => {

    let deleteEventInfo = await csrfFetch(`/api/events/${id}`, {
        method: "DELETE"
    });

    deleteEventInfo = deleteEventInfo.json()
    dispatch(deleteEvent(id));
    return deleteEventInfo;


}



export const thunkGetEventsByGroup = (id) => async (dispatch) => {

    const response = await csrfFetch(`/api/groups/${id}/events`);
    const data = await response.json();

    dispatch(getGroupEvents(data.Events));
    return response;
};



export const thunkGetEvents = () => async (dispatch) => {
    const response = await csrfFetch('/api/events')



    const data = await response.json()

    let events = data.Events
    for (let i = 0; i < events.length; i++) {

        let eventRes = await csrfFetch(`/api/events/${events[i].id}`);
        eventRes = await eventRes.json()

        data.Events[i].description = eventRes.description
    }

    dispatch(getAllEvents(data.Events))
    return data
}


export const thunkCreateEvent = (formData) => async (dispatch) => {


    try {
    const { name, about, type, price, startTime, endTime, privacy, img, id } = formData;

console.log("id for thunk", id)
    let capacity = 100;


        let newEvent = await csrfFetch(`/api/groups/${id}/events`, {

            method: "POST",
            body: JSON.stringify({
                name, about, type, capacity, private: formData.private, price, startDate: startTime, endDate: endTime, description: about, capacity: 100, venueId: 1
            }),
        });



        if (newEvent.ok) {
            let data = await newEvent.json()



            console.log("event data",data)

            let imgRes = await csrfFetch(`/api/events/${data.id}/images`, {
                method: "POST",
                body: JSON.stringify({
                    preview: true, url: img
                }),
            })

            imgRes = imgRes.json()

            data.EventImages = [imgRes]


            dispatch(createEvent(data));

            return data

        }


    } catch (error) {


        let err = await error.json()
        console.log( "error from create thunk", err)
        return err

    }








}

/*
signle event pull
eventid/attendance  find attending marked as host
*/



export const thunkGetEvent = (id) => async (dispatch) => {

    const response = await csrfFetch(`/api/events/${id}`);

    const data = await response.json();



    const response2 = await csrfFetch(`/api/events/${id}/attendees/`);

    const attendance = await response2.json();
    data.attendance = attendance.Attendees




    dispatch(getEvent(data));
    return data;
};


// types
const GET_GROUP_EVENTS = "EVENTS/GetGroupEvents";
const GET_ALL_EVENTS = 'EVENTS/getAllEvents'
const GET_EVENT = 'EVENTS/getEvent'
const CREATE_EVENT = 'EVENT/create'
const DELETE_EVENT = "EVENT/delete"
//actins



const deleteEvent = (id) => {
    return {
        type: DELETE_EVENT,
        id
    }
}

const createEvent = (newEvent) => {
    return {
        type: CREATE_EVENT,
        newEvent
    }
}


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

            let stateReset = Object.assign({}, state)
            stateReset.singleEvent = action.eventData



            return stateReset


        case CREATE_EVENT:
            let createState = Object.assign({}, state)

            createState.allEvents[action.newEvent.id] = action.newEvent

            return createState


        case DELETE_EVENT:
            let deleteState = Object.assign({}, state)

            let deleteId = action.id


            delete deleteState.allEvents[deleteId]




            return deleteState

        default:
            return state;
    }
};


export default eventsReducer
