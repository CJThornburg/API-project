
import React, { useEffect } from "react";
import { Link } from "react-router-dom";



import './EventCard.css'



function EventCard({ event, from }) {




    // console.log(event)

    return (
        <>
            <Link className="Ec-link GL-link" to={`/events/${event.id}`}>
                <div className={from === "Events"? "Ec-card-events": ""}>

                <div className="Ec-upper-half Gl-group">

                    <img className='Ec-photo ' src={event.previewImage} alt="event preview image"></img>

                    <div className="Ec-upper-right ">
                        <p className="teal-text Ec-dateInfo">{`${event.justDate} · ${event.time}`}

                        </p>
                        <h4 className="Ec-event-title">
                            {event.name.toUpperCase()}
                        </h4>
                        <p >{event.Venue?.city} , {event.Venue?.state} </p>
                    </div>
                </div>
                <div className="overflow">
                    <p className="Ec-desc">
                        {event.description}
                    </p>
                </div>


                </div>


            </Link>
        </>
    );
}

export default EventCard;
