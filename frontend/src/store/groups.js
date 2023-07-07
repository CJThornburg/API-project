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
    const { name, about, type, city, state, img } = formData;
    console.log( "START OF CREATE GROUP THUNK => is the passed in object deconstructed", "name", name, "about", about, "type", type, "city", city, "state", "private", formData.private,)

    let newGroup = await csrfFetch("/api/groups", {

        method: "POST",
        body: JSON.stringify({
            name, about, type, city, state, private: formData.private
        }),
    });


    newGroup = await newGroup.json()

    const imgRes = await csrfFetch(`/api/groups/${newGroup.id}/images`, {
        method: "POST",
        body: JSON.stringify({
            preview: true, url: img
        }),
    })

    newGroup.events = []

    const imgData = await imgRes.json()

    newGroup.GroupImages = [imgData]

    dispatch(createGroup(newGroup));
    return newGroup;
};

export const thunkDeleteGroup = (id) => async (dispatch) => {

    let deleteGroupInfo = await csrfFetch(`/api/groups/${id}`, {
        method: "DELETE"
    });

    dispatch(deleteGroup(id));
    return deleteGroupInfo;


}
// !!!!!!!!!!!!!!!!!!! you are here need to figure out how to pass img only if it is there

export const thunkEditGroup = (editGroup) => async (dispatch) => {
    const { name, about, type, city, state, id } = editGroup

    console.log(editGroup.private)
    let editGroupData = await csrfFetch(`/api/groups/${id}`, {

        method: "PUT",
        body: JSON.stringify({
            name, about, type, city, state, private: editGroup.private
        }),
    });
    editGroupData = editGroupData.json()
    dispatch(updateGroup(editGroupData))
    return editGroupData
}









// types
const GET_GROUPS = "Groups/getGroups";
const GET_GROUP = "Groups/getGroup";
const GET_GROUP_EVENTS = "EVENTS/GetGroupEvents";
const DELETE_GROUP = "Group/delete"
const CREATE_GROUP = "Group/create"
const UPDATE_GROUP = 'GROUP/update'
// // const CREATE_GROUP = "Group/create"
// //actins


const updateGroup = (editGroup) => {
    return {
        type: UPDATE_GROUP,
        editGroup
    }
}



const createGroup = (newGroup) => {
    console.log("in create group action creator, this was what was passed to me", newGroup)
    return {
        type: CREATE_GROUP,
        newGroup
    }
}

const deleteGroup = (id) => {
    return {
        type: DELETE_GROUP,
        id
    }
}

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
            console.log(action.groupData, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

            return newGroupsState;

        case GET_GROUP:
            console.log("in get group :)")
            let stateReset = Object.assign({}, state)
            stateReset.singleGroup = action.groupData


            console.log(stateReset.singleGroup)
            return stateReset

        case GET_GROUP_EVENTS:
            let newStateEvents = Object.assign({}, state)


            let currentId = action.eventsData.id


            newStateEvents.allGroups[currentId][`events`] = action.eventsData

            return newStateEvents

        case DELETE_GROUP:
            let deleteState = Object.assign({}, state)
            console.log(action.id, "action id?")
            let deleteId = action.id

            delete deleteState.allGroups[deleteId]




            return deleteState


        case CREATE_GROUP:
            let createState = Object.assign({}, state)

            createState.allGroups[action.newGroup.id] = action.newGroup

            return createState


        case UPDATE_GROUP:
            let updateState = Object.assign({}, state)
        
            updateState.allGroups[action.editGroup.id] = action.editGroup

            return updateState

        default:
            return state;
    }
};


export default groupsReducer
