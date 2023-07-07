
import React, { useEffect } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";


import './EventCard.css'



function EventCard({ event }) {


console.log(event)


    return (
        <>
            <Link className="Ec-link" to={`/events/${event.id}`}>

                <div className="Ec-outer-Card">
                    <div className="Ec-upper-half">
                        <img className='Ec-photo' src={event.previewImage} alt="event preview image"></img>
                        <div className="Ec-upper-right">
                            <p>{`${event.justDate} · ${event.time}`}

                            </p>
                            <h4>
                                {event.name.toUpperCase()}
                            </h4>
                            <p>{event.venue ? event.venue : "online"}</p>
                        </div>
                        <p>
                            {event.description}
                        </p>
                    </div>


                </div>
            </Link>
        </>
    );
}

export default EventCard;
