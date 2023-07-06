import meetupGraphicPlaceHolder from "./img/meetupGraphicPlaceHolder.PNG"
import LandingPageCard from './LandingPageCard'
import { Link } from 'react-router-dom'
import './LandingPage.css'




function LandingPage() {



    return (
        <>
            <div className="lP-sections">
                <section className="lP-section section1">
                    <div className="title-hook">
                        <h1 className="website-title">
                            OrganizeDown
                        </h1>
                        <p className="hook">
                            Organize down is the place to meet new organizers and help bring power and events to your community!
                        </p>
                    </div>
                    <img src={meetupGraphicPlaceHolder} >

                    </img>
                </section>
                <section className="lP-section section2">
                    <div className="lP-subtitle-sentence">
                        <h2>
                            How OrganizeDown works
                        </h2>
                        <p>
                            well you find the groups, you make the events and you take the pictures
                        </p>
                    </div>

                </section>
                <section className="lP-section section3">

                    <div className="lP-card">
                        <img className="lP-card-img" src="https://cdn-icons-png.flaticon.com/512/5363/5363451.png"></img>

                        <Link className="lP-link" to="/groups">
                            <h3 >See fellow Groups</h3>
                        </Link>
                        <p>dsfds sdfldsjf sdfldsj sdflkdsj sfdlskjf sdfkdslj </p>
                    </div>
                    <div className="lP-card">
                        <img className="lP-card-img" src="https://cdn-icons-png.flaticon.com/512/5363/5363451.png"></img>
                        {/* to="find an event" */}
                        <Link className="lP-link" to="/events">
                            <h3 >Find an Event</h3>
                        </Link>
                        <p>dsfds sdfldsjf sdfldsj sdflkdsj sfdlskjf sdfkdslj </p>
                    </div>
                    <div className="lP-card">
                        <img className="lP-card-img" src="https://cdn-icons-png.flaticon.com/512/5363/5363451.png"></img>
                        {/* to="See all groups" */}
                        <Link className="lP-link" to='/groups/new'>
                            <h3 >start a new group</h3>
                        </Link>
                        <p>dsfds sdfldsjf sdfldsj sdflkdsj sfdlskjf sdfkdslj </p>
                    </div>

                </section>
                <section className="lP-section section4">
                    <button>
                        Join OrganizeDown
                    </button>
                </section>
            </div>
        </>
    );
}

export default LandingPage;
