import React, { useState, useEffect } from "react";
import Header from '../Header'
import EventNumber from "./EventNumber";
import './GroupsList.css'
import { useDispatch, useSelector } from "react-redux";
import * as groupsActions from '../../store/groups'
import {Link} from "react-router-dom";
// import * as eventsActions from '../../store/events'




function GroupsList() {
    const dispatch = useDispatch()
    // turns stat.groups.allGroups into an array
    const groups = useSelector(state => Object.values(state.groups.allGroups));

    useEffect(() => {

        // declare the data fetching function
        dispatch(groupsActions.thunkGetGroups())



    }, [dispatch])

    if (!Object.keys(groups).length ) return null


    return (
        <>
            <Header active="Groups"></Header>
            {/* array map */}


            {groups.map((group) => (
                <Link className="GL-link" to={`/groups/${group.id}`}>
                <div key={group.id} className='GL-group'>
                    <img src={group?.previewImage} alt="alt descripiton" className='GL-photo'></img>
                    <div className='GL-dets'>
                        <h3>
                            {group.name}
                        </h3>
                        <p className="Groups-location">{`${group.city}, ${group.state}`}</p>
                        <p className="Groups-desc">{group.about}  </p>
                        <div className="GL-mini-dets">
                            {/* <EventNumber key={group.id} gid={group.id} ></EventNumber> */}
                            <p> #{group.numMembers} member(s)</p>
                            <p className="dot">·</p>
                            <p>{group.private ? "Private" : "Public"}</p>
                        </div>
                    </div>
                </div>
                </Link>
            ))}


        </>
    );
}

export default GroupsList;
