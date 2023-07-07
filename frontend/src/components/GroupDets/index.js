import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import EventCard from "../EventCard";


import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import * as groupsActions from '../../store/groups'
import OpenModalButton from '../OpenModalButton';
import DeleteGroupModal from "./DeleteGroupModal";
import './GroupDets.css'

function GroupDets() {
    const { id } = useParams()

    let lessThan = "<"
    // let events
    const dispatch = useDispatch()
    const group = useSelector(state => state.groups.singleGroup);

    const currentUser = useSelector(state => state.session)










    // one thunk that does two fetches
    useEffect(() => {
        dispatch(groupsActions.thunkGetGroup(id))

    }, [dispatch, id])


    if (!Object.keys(group).length) return null
    console.log(group, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    let ownerCheck = false
    let render = true



    if (currentUser?.user && currentUser.user?.id) {

        if (currentUser.user?.id !== null && group) {
            render = currentUser.user?.id !== group.Organizer?.id
        }

    }



    if (currentUser?.user) {
        ownerCheck = currentUser.user?.id === group.Organizer?.id
    }




    if (currentUser.user === null) {
        render = false
    }









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
    // let previewImageObj


    // console.log("group", group)
    // if(group.GroupImages > 0) {
    //    previewImageObj = group.GroupImages.find(img => img.preview === true)
    // }
    // console.log(previewImageObj)

    if (group.events) {
        let currentDate = new Date().getTime()



        // check if any upcoming

        for (let i = 0; i < group.events.length; i++) {

            let start = new Date(group.events[i].startDate).getTime()
            group.events[i].start = start
            let hour = new Date(group.events[i].startDate).getHours()
            let min = new Date(group.events[i].startDate).getMinutes()
            group.events[i].time = `${hour}:${min}`

            group.events[i].justDate = formatDate(new Date(group.events[i].startDate))

            if (start > currentDate) { upEvents.push(group.events[i]) } else { pastEvents.push(group.events[i]) }
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
                <img className="Gd-group-img" src={group.GroupImages?.find(img => img.preview)?.url} alt="group preview image"></img>

                <div className="Gd-header-details">
                    <h3>{group?.name}</h3>
                    <div className="Gd-mini-dets">
                        {`${group?.city}, ${group?.state}`}

                        <p className="dot">·</p>
                        <p>{group?.private ? "Private" : "Public"}</p>
                        <p>
                            Organized by {group.Organizer?.firstName} {group.Organizer?.lastName}
                        </p>
                    </div>
                </div>
                {render && <button onClick={() => { alert("coming soon") }} className="Gd-join-btn">Join this group</button>}
                {ownerCheck &&
                    <>
                        <button className="Gd-action-btn">Create event</button>
                        <button className="Gd-action-btn">update</button>
                        <button className="Gd-action-btn" onClick={() => { alert("hi") }}>Delete</button>
                        <OpenModalButton buttonText='Delete' modalComponent={<DeleteGroupModal id={ id } />} />
                    </>
                }

            </div>
            <div>
                <div className="Gd-details-Organizer-div">
                    <h3>Organizer</h3>
                    <p>
                        {group.Organizer?.firstName} {group.Organizer?.lastName}
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
