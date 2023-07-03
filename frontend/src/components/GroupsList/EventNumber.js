
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import * as eventsActions from '../../store/events'
import * as groupsActions from '../../store/groups'


function EventNumber({ gid }) {
    const dispatch = useDispatch()

    useEffect(() => {



        console.log("GID", gid)
        dispatch(groupsActions.thunkGetEventsByGroup(gid.id))

    }, [])

    return (
        <>

            <p>{gid.id}# "#" events </p>
        </>
    );
}

export default EventNumber;
