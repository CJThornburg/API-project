import React, { useEffect, useState } from "react";
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
    // let [groups, setGroups] = useState({})
    // let [img, setImg] = useState("https://t4.ftcdn.net/jpg/04/70/29/97/240_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg")










    // one thunk that does two fetches
    useEffect(() => {
        dispatch(groupsActions.thunkGetGroup(id))

    }, [dispatch, id])








    if (!Object.keys(group).length) return null


    console.log(group)
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
            <div className="column-holder Gd-nav-padding">
                <div className="column">
                    <div className="Gd-breadcrumb-div">
                        <p className="bread-text">{lessThan} <Link to="/groups" className="Gd-breadcrumb"> Groups
                        </Link> </p>
                    </div>
                    <div className="Gd-header-div">
                        <img className="Gd-group-img" src={group.GroupImages?.find(img => img.preview)?.url} alt="group preview image"></img>

                        <div className="Gd-header-details overflow">
                            <h3 className="Gd-name">{group?.name}</h3>
                            <div className="Gd-mini-dets">
                                <p className="Gd-dets-item">
                                    {`${group?.city}, ${group?.state}`}

                                </p>

                                <div className="Gd-events-privacy Gd-dets-item">
                                    <p>{group.events[0] ? `# ${group.events.length} events ` : `#0 events `}
                                        ·
                                        {group?.private ? " Private" : " Public"}</p>
                                </div>
                                <p className="Gd-dets-item">
                                    Organized by {group.Organizer?.firstName} {group.Organizer?.lastName}
                                </p>
                            </div>
                            {render && <button onClick={() => { alert("coming soon") }} className="Gd-join-btn Gd-action-btn">Join this group</button>}
                            {ownerCheck &&
                                <div className="Gd-buttons-div">
                                    <Link to={`/groups/${id}/events/new`}><button className="Gd-action-btn cursor">Create event</button></Link>
                                    <Link to={`/groups/${id}/edit`}> <button className="Gd-action-btn margin-right cursor" >update</button></Link>

                                    <OpenModalButton buttonText='Delete' from="GD" modalComponent={<DeleteGroupModal id={id} />} />
                                </div>
                            }
                        </div>


                    </div>
                </div>
            </div>

            <div className="Gd-grey">
                <div className="column-holder">
                    <div className="column">
                        <div className="Gd-details-Organizer-div">
                            <h3 className="Gd-org2">Organizer</h3>
                            <p className="Gd-mini-dets Gd-org-name">
                                {group.Organizer?.firstName} {group.Organizer?.lastName}
                            </p>
                        </div>
                        <div className="Gd-details-about-div overflow">
                            <h3 className="Gd-what">What we're about</h3>
                            <p className="Gd-about">{group?.about}</p>
                        </div>


                        {upEvents.length > 0 ? <h2 className="Gd-event-sec-title">Upcoming Events ({upEvents.length})</h2> : <h2 className="Gd-event-sec-title no-events">No upcoming events</h2>}

                        {upEvents.map((event) => (
                            <div className="Gd-details-Events-div">
                                <div className="Gd-details-Events-inner-div">


                                    <EventCard key={event.id} event={event} from="Group"></EventCard>
                                </div>

                            </div>
                        ))}

                        {pastEvents.length > 0 ? <h2 className="Gd-event-sec-title">Past Events ({pastEvents.length})</h2> :
                            <h2 className="Gd-event-sec-title no-events">No past events</h2>
                        }

                        {pastEvents.map((event) => (
                            <div className="Gd-details-Events-div">
                                <div className="Gd-details-Events-inner-div">
                                    <EventCard key={event.id} event={event} from="Group"></EventCard>
                                </div>
                            </div>
                        ))}

                        {group.events.length === 0 && <div className="no-event-filler"></div>}
                    </div>
                </div>
            </div>

        </>
    );
}

export default GroupDets;
