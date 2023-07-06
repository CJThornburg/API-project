import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from 'react-router-dom'
import './EventDets.css'
import { useEffect } from "react";
import * as eventsActions from '../../store/events'
import * as groupsActions from '../../store/groups'


/*
signle event pull
eventid/attendance  find attending marked as host
*/




function EventDets() {
    const { id } = useParams()
    let lessThan = "<"

    const dispatch = useDispatch()
    const event = useSelector(state => state.events.singleEvent);
    const groupS = useSelector(state => state.groups.singleGroup);
    // const currentUser = useSelector(state => state.session)


    let group
    if (event?.Group) {
        group = event.Group
    }

    let groupPI
    if (groupS?.GroupImages) {
        let groupPreviewImgObj = (groupS.GroupImages.find(image => image.preview === true))
        groupPI = groupPreviewImgObj.url
    }

    let previewImg
    if (event.EventImages?.length > 0) {
        let previewImgObj = (event.EventImages.find(image => image.preview === true))
        previewImg = previewImgObj.url
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
        event.timeEnd = `${hour}:${min}`
        event.justDateEnd = formatDate(new Date(event.endDate))
    }








    useEffect(() => {
        dispatch(eventsActions.thunkGetEvent(id))
        dispatch(groupsActions.thunkGetGroup(id))

    }, [dispatch, id])



    return (
        <>
            <div className="Ed-header">
                <div className="Ed-breadcrumb-div">
                    <p>{lessThan} <Link to="/events" className="Gd-breadcrumb"> Events
                    </Link> </p>
                </div>
                <div className="Ed-title-div">
                    <h3>{event?.name}</h3>
                    <h5>Hosted by  {groupS.Organizer?.firstName} {groupS.Organizer?.lastName} </h5>
                </div>
            </div>
            <div className="Ed-main">
                <div className="Ed-image-cards-div">
                    <img className="Ed-event-img" src={previewImg && previewImg}></img>
                    <div className="Ed-cards-div">
                        <img className="Ed-group-img" src={groupPI && groupPI}></img>
                        <div className="Ed-group-card-text">
                            <h6> {group?.name}</h6>
                            <p>{group?.private ? "Private" : "Public"}</p>
                        </div>
                    </div>
                    <div className="Ed-event-card">
                        <div className="Ed-times">
                            <p>clock icon</p>
                            <div className="Ec-time-div">
                                <p><span className="Ec-grey">START</span> <span className="Ed-teal"> {event?.justDate} · {event?.time}</span></p>
                                <p><span className="Ec-grey">END</span> <span className="Ed-teal">  {event?.justDateEnd} · {event?.timeEnd}</span></p>
                            </div>

                        </div>
                        <div className="Ed-price">
                            <p>icon</p>
                            <p>{event?.price}</p>
                        </div>
                        <div className="Ed-price">
                            <p>icon</p>
                            <p>{event?.Venue === null ? "online" : event.Venue}</p>
                        </div>
                    </div>
                </div>
                <div className="Ed-details">
                    <h4>Details</h4>
                    <p>
                        {event?.description}
                    </p>
                </div>
            </div>
        </>
    );
}

export default EventDets;
