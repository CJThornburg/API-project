
import React, { useEffect } from "react";


import './GroupDets.css'



function EventCard({ event }) {






    return (
        <>
            <div className="Ec-outer-Card">
                <div className="Ec-upper-half">
                    <img className='Ec-photo' src="https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8M3x8fGVufDB8fHx8fA%3D%3D&w=1000&q=80" alt="event preview image"></img>
                    <div className="Ec-upper-right">
                        <p>{`${event.justDate} · ${event.time}`}

                        </p>
                        <h4>
                           {event.name.toUpperCase()}
                        </h4>
                        <p>{event.venue? event.venue : "online"}</p>
                    </div>
                    <p>
                       {event.description}
                    </p>
                </div>


            </div>
        </>
    );
}

export default EventCard;
