import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import EventCard from "./EventCard";

// import * as sessionActions from "./store/session";
// import Navigation from "./components/Navigation";
// import LandingPage from "./components/LandingPage";
// import GroupsList from "./components/GroupsList";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import * as groupsActions from '../../store/groups'

function GroupDets() {
    const { id } = useParams()
    let lessThan = "<"
    // let events
    const dispatch = useDispatch()
    const group = useSelector(state => state.groups.allGroups[id]);
    const events = useSelector(state => state.groups.allGroups[id]?.events)
    useEffect(() => {

        const groupDet = async () => {

            console.log("GID", id)
            await dispatch(groupsActions.thunkGetGroups())
            await dispatch(groupsActions.thunkGetEventsByGroup(id))


            // if (group) { events = group.events }

        }
        groupDet()

    }, [id])

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


    let noEvents = false
    let upEvents = []
    let pastEvents = []
    if (events) {
        let currentDate = new Date().getTime()
        console.log(currentDate)
        if (events.length === 0) {
            noEvents = true
        }




        // check if any upcoming
        for (let i = 0; i < events.length; i++) {
            let start = new Date(events[i].startDate).getTime()
            events[i].start = start
            let hour = new Date(events[i].startDate).getHours()
            let min = new Date(events[i].startDate).getMinutes()
            events[i].time = `${hour}:${min}`

            events[i].justDate =formatDate( new Date(events[i].startDate))

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
                <image src="groups preview image" alt="group preview image"> </image>

                <div className="Gd-header-details">
                    <h3>"Group name"</h3>
                    <div className="Gd-mini-dets">
                        {/* <EventNumber key={group.id} gid={group} ></EventNumber> */}
                        <p className="dot">·</p>
                        <p>{
                            {/* group.private */ }
                                ? "Private" : "Public"}</p>
                        <p>Organized by "firstname" "last name"</p>
                    </div>
                </div>
                <button className="Gd-join-btn">Join this group</button>
            </div>
            <div>
                <div className="Gd-details-Organizer-div">
                    <h3>Organizer</h3>
                    <p>"firstName" "lastname"</p>
                </div>
                <div className="Gd-details-about-div">
                    <h3>What we're about</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque efficitur erat eu ligula venenatis, non dignissim nulla efficitur. Vivamus laoreet sit amet diam vel fringilla. Ut eget leo rhoncus ex fermentum laoreet. Nunc aliquam quam odio, id venenatis augue placerat ut. Fusce condimentum est diam, ac vestibulum lorem varius et. Duis placerat ac nisl in porta. Aliquam maximus ipsum leo, nec condimentum erat consequat vel. Vivamus libero leo, pharetra imperdiet nulla quis, imperdiet lobortis arcu. Praesent et tristique mauris, eget feugiat dui.</p>
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
