
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import * as eventsActions from '../../store/events'
import * as groupsActions from '../../store/groups'



function EventNumber({ gid }) {
    let id = gid
    const dispatch = useDispatch()
    const group = useSelector(state => state.groups.allGroups[gid.id]);



    useEffect(() => {



      
        dispatch(groupsActions.thunkGetEventsByGroup(gid.id))

    }, [group])

    return (
        <>

            <p>#{group.events ? group.events.length : 0} event(s) </p>
        </>
    );
}

export default EventNumber;
