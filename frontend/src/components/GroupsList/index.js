import React, { useState, useEffect } from "react";
import Header from '../Header'
import EventNumber from "./EventNumber";
import './GroupsList.css'
import { useDispatch, useSelector } from "react-redux";
import * as groupsActions from '../../store/groups'




function GroupsList() {
    const dispatch = useDispatch()
    const groups = useSelector(state => state.groups);

    useEffect(() => {

        // declare the data fetching function
        dispatch(groupsActions.thunkGetGroups())

        // dispatch(eventsActions.thunkGetEventsByGroup(groupId))

        console.log("hiiiiiiiiii")
    }, [])


    return (
        <>
            <Header active="Groups"></Header>
            {/* array map */}


            {groups.map((group) => (

                <div key={group.id} className='GL-group'>
                    <img src={group.previewImage} alt="puppy" className='GL-photo'></img>
                    <div className='GL-dets'>
                        <h3>
                            {group.name}
                        </h3>
                        <p className="Groups-location">{`${group.city}, ${group.state}`}</p>
                        <p className="Groups-desc">{group.about}  </p>
                        <div className="GL-mini-dets">
                            <EventNumber key={group.id} gid={group} ></EventNumber>
                            <p># "#" events </p>
                            <p className="dot">·</p>
                            <p>{group.private ? "Private" : "Public"}</p>
                        </div>
                    </div>
                </div>
            ))}


        </>
    );
}

export default GroupsList;