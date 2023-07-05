import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import EventCard from "./EventCard";


import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import * as groupsActions from '../../store/groups'
import * as userActions from '../../store/users'

function GroupDets() {
    const { id } = useParams()
    let lessThan = "<"
    // let events
    const dispatch = useDispatch()
    const group = useSelector(state => state.groups.allGroups[id]);
    const events = useSelector(state => state.groups.allGroups[id]?.events)
    const groupOwnerID = useSelector(state => state.groups.allGroups[id]?.organizerId)
    // const owner = useSelector(state => state.groups.allGroups[id])

    const owners = useSelector(state => Object.values(state.users));

    if (owners) console.log(owners)
    const ownerInfo = owners.find(user => user.id === groupOwnerID)


    if (ownerInfo) console.log(ownerInfo.firstName)

    if (group) console.log("group", groupOwnerID)


    useEffect(() => {



            dispatch(groupsActions.thunkGetGroups())
            dispatch(userActions.thunkGetUser(groupOwnerID))
            dispatch(groupsActions.thunkGetEventsByGroup(id))




            // if (group) { events = group.events }



    }, [dispatch])


    // useEffect (() => {
    //     dispatch(groupsActions.thunkGetGroups()).then(dispatch(userActions.thunkGetUser(groupOwnerID)))
    // }, [])

    // date and time manipulation
    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }
    function formatDate(date) {
        return [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-');
    }



    let upEvents = []
    let pastEvents = []
    if (events) {
        let currentDate = new Date().getTime()



        // check if any upcoming
        for (let i = 0; i < events.length; i++) {
            let start = new Date(events[i].startDate).getTime()
            events[i].start = start
            let hour = new Date(events[i].startDate).getHours()
            let min = new Date(events[i].startDate).getMinutes()
            events[i].time = `${hour}:${min}`

            events[i].justDate = formatDate(new Date(events[i].startDate))

            if (start > currentDate) { upEvents.push(events[i]) } else { pastEvents.push(events[i]) }
            // compart start to current time and then push to corresponding array

        }
        upEvents.sort((a, b) => a.start - b.start)
        pastEvents.sort((a, b) => a.start - b.start)



    }

    return (
        <>
            <div className="Gd-header-div">
                <div className="Gd-breadcrumb-div">
                    <p>{lessThan} <Link to="/groups" className="Gd-breadcrumb"> Groups
                    </Link> </p>
                </div>
                <img src="groups preview image" alt="group preview image"></img>

                <div className="Gd-header-details">
                    <h3>{group?.name}</h3>
                    <div className="Gd-mini-dets">
                        {`${group?.city}, ${group?.state}`}

                        <p className="dot">·</p>
                        <p>{group?.private ? "Private" : "Public"}</p>
                        <p>Organized by {ownerInfo?.firstName} {ownerInfo?.lastName}
                        </p>
                    </div>
                </div>
                <button className="Gd-join-btn">Join this group</button>
            </div>
            <div>
                <div className="Gd-details-Organizer-div">
                    <h3>Organizer</h3>
                    <p>
                        {ownerInfo?.firstName} {ownerInfo?.lastName}
                    </p>
                </div>
                <div className="Gd-details-about-div">
                    <h3>What we're about</h3>
                    <p>{group?.about}</p>
                </div>
                <div className="Gd-details-Events-div">

                    {upEvents.length > 0 && <h2>Upcoming Events ({upEvents.length})</h2>}
                    {upEvents.map((event) => (
                        <EventCard key={event.id} event={event}></EventCard>
                    ))}
                    {pastEvents.length > 0 && <h2>Past Events ({pastEvents.length})</h2>}
                    {pastEvents.map((event) => (
                        <EventCard key={event.id} event={event}></EventCard>
                    ))}

                </div>
            </div>
        </>
    );
}

export default GroupDets;
