import React, { useState, useEffect } from "react";
import Header from '../Header'
// import EventNumber from "./EventNumber";
import './EventsList.css'
import { useDispatch, useSelector } from "react-redux";
import * as eventsActions from '../../store/events'
import { Link } from "react-router-dom";
import EventCard from "../EventCard";
import './EventsList.css'
// import * as eventsActions from '../../store/events'




function EventsList() {
    const dispatch = useDispatch()

    // turns stat.groups.allGroups into an array
    const events = useSelector(state => Object.values(state.events.allEvents));


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

        for (let i = 0; i < events.length; i++) {

            let start = new Date(events[i].startDate).getTime()
            events[i].start = start
            let hour = new Date(events[i].startDate).getHours()
            let min = new Date(events[i].startDate).getMinutes()
            events[i].time = `${hour}:${min}`

            events[i].justDate = formatDate(new Date(events[i].startDate))

            if (start > currentDate) { upEvents.push(events[i]) } else { pastEvents.push(events[i]) }


        }
        upEvents.sort((a, b) => a.start - b.start)
        pastEvents.sort((a, b) => a.start - b.start)




    }




    useEffect(() => {

        // declare the data fetching function
        dispatch(eventsActions.thunkGetEvents())



    }, [])


    return (
        <>
            <Header active="Events"></Header>
            {/* array map */}



            {upEvents.map((event) => (

                <EventCard key={event.id} event={event}></EventCard>
            ))}

            {pastEvents.map((event) => (

                <EventCard key={event.id} event={event}></EventCard>
            ))}
            {/* <Link className="GL-link" to={`/events/${event.id}`}>
                <div key={event.id} className='GL-group'>
                    <img src={event.previewImage} alt="puppy" className='GL-photo'></img>
                    <div className='GL-dets'>
                        <h3>
                            {event.name}
                        </h3>
                       {event.venueId &&  <p className="Event-location">{`${event.Venue.city}, ${event.Venue.state}`}</p>}
                       {!event.venueId && <p className="Event-location">Online</p>}
                        <p className="Groups-desc">{event.about}  </p>
                        <div className="GL-mini-dets">

                        </div>
                    </div>
                </div>
                </Link>
            ))} */}


        </>
    );
}

export default EventsList;
