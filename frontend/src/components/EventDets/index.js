import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from 'react-router-dom'
import './EventDets.css'
import { useEffect } from "react";
import * as eventsActions from '../../store/events'
import * as groupsActions from '../../store/groups'
import { useState } from "react";
import OpenModalButton from '../OpenModalButton';
import DeleteEventModal from "./DeleteEventModal";



function EventDets() {
    const { id } = useParams()
    let lessThan = "<"

    const dispatch = useDispatch()
    const event = useSelector(state => state.events.singleEvent);
    const groupI = useSelector(state => state.groups.singleGroup);
    const currentUser = useSelector(state => state.session.user)
    const [groupInfo, setGroupInfo] = useState({})
    console.log("current user", currentUser)
    // .user becuse the inital state is {user: null}

    useEffect(() => {
        const thunks = async () => {
            let eventInfo = await dispatch(eventsActions.thunkGetEvent(id))
            // need to chancge this to group id


            let groupData = await dispatch(groupsActions.thunkGetGroup(eventInfo.groupId))


        }
        thunks()

    }, [dispatch, id])


    if (!(Object.keys(event).length && Object.keys(groupI).length)) return null

    let group
    if (event?.Group) {
        group = event.Group
    }

    let groupPI = "https://t4.ftcdn.net/jpg/04/70/29/97/240_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"

    if (groupI.GroupImages.length > 0) {
        let groupPreviewImgObj = groupI.GroupImages.find(image => image.preview === true)

        if (groupPreviewImgObj) {
            groupPI = groupPreviewImgObj.url
        }
    }



    let previewImg = "https://t4.ftcdn.net/jpg/04/70/29/97/240_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
    if (event.EventImages?.length > 0) {

        let previewImgObj = (event.EventImages.find(image => image.preview === true))

        if (previewImgObj) {
            previewImg = previewImgObj.url
        }
    }

    let host
    if (event.attendance?.length > 0) {

        host = (event.attendance.find(atten => atten.Attendance.status === "host")
        )

    }

    let hostCheck = false

    if (currentUser && host) {
        if (currentUser.id === host.id) {
            hostCheck = true
        }

    }


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

    if (event?.startDate) {


        let hour = new Date(event.startDate).getHours()
        let min = new Date(event.startDate).getMinutes()
        event.time = `${hour}:${min}`
        event.justDate = formatDate(new Date(event.startDate))

        let hourEnd = new Date(event.endDate).getHours()
        let minEnd = new Date(event.endDate).getMinutes()
        event.timeEnd = `${hourEnd}:${minEnd}`
        event.justDateEnd = formatDate(new Date(event.endDate))
    }






    console.log("EVENT", event)




    return (
        <>
            <div className="column-holder Gd-nav-padding">
                <div className="column">

                    <div className="Ed-header">
                        <div className="Ed-breadcrumb-div">
                            <p>{lessThan} <Link to="/events" className="Gd-breadcrumb"> Events
                            </Link> </p>
                        </div>
                        <div className="Ed-title-div">
                            <h3 className="Ed-event-name">{event?.name}</h3>
                            <h5 className="Ed-Host">Hosted by  {host?.firstName} {host?.lastName} </h5>
                            {hostCheck &&
                                <> <OpenModalButton buttonText='Delete' from="GD" modalComponent={<DeleteEventModal id={id} />} /></>

                            }
                        </div>
                    </div>

                </div>
            </div>

            <div className="Ed-main">
                <div className="column-holder Gd-nav-padding">
                    <div className="column">

                        <div className="Ed-image-cards-div">
                            <img className="Ed-event-img" src={previewImg && previewImg}></img>
                            <div className="Ed-cards-div">


                                <div className="Ed-group-card">
                                    <img className="Ed-group-img" src={groupPI}></img>
                                    <div className="Ed-group-card-text overflow">
                                        <h6 className="Ed-group-name"> {group?.name}</h6>
                                        <p className="Ed-group-name grey-text" >{group?.private ? "Private" : "Public"}</p>
                                    </div>
                                </div>




                                <div className="Ed-event-card">
                                    <div className="Ed-times Ed-icon-row">
                                    <i class="Ed-icon fas fa-regular fa-clock"></i>
                                        <div className="Ec-time-div">
                                            <p><span className="Ec-grey grey-text Ec-start">START</span> <span className="Ed-teal teal-text"> {event?.justDate} · {event?.time}</span></p>
                                            <p><span className="Ec-grey grey-text Ec-end">END</span> <span className="Ed-teal teal-text">  {event?.justDateEnd} · {event?.timeEnd}</span></p>
                                        </div>

                                    </div>
                                    <div className="Ed-price Ed-icon-row">
                                    <i class="fas fa-solid fa-dollar-sign Ed-icon Ed-dollar"></i>
                                        <p className="Ed-price-value grey-text"> {event.price? event.price : "Free"}</p>
                                    </div>
                                    <div className="Ed-privacy Ed-icon-row">
                                    <i class=" fas fa-solid fa-map-pin  Ed-icon  Ed-pin"></i>
                                        <p className="Ed-type-text grey-text" >{event?.Venue === null ? "online" : "in person"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="Ed-details overflow">
                            <h4 className="Ed-dets-title">Details</h4>
                            <p className="Ed-dets">
                                {event?.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
}

export default EventDets;
