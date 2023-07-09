import meetupGraphicPlaceHolder from "./img/meetupGraphicPlaceHolder.PNG"
import LandingPageCard from './LandingPageCard'
import { Link } from 'react-router-dom'
import './LandingPage.css'
import { useSelector } from 'react-redux';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import SignupFormModal from '../SignupFormModal';



function LandingPage() {

    const user = useSelector(state => state.session.user);

    return (
        <>
            <div className="lP-sections">
                <section className="lP-section section1">
                    <div className="title-hook">
                        <h1 className="website-title">
                            The people platform - Where interests become friendships
                        </h1>
                        <p className="hook">
                            Organize down is the place to meet new organizers and help bring power and events to your community!
                        </p>
                    </div>
                    <div className="meetupImg-div">

                        <img className="meetupImg" src={meetupGraphicPlaceHolder} >
                        </img>
                    </div>

                </section>
                <section className="lP-section section2">
                    <div className="lP-subtitle-sentence">
                        <h2 className="sec2-title">
                            How OrganizeDown works
                        </h2>
                        <p className="s2-text">
                            Meet new people who share your interests through online and in-person events. It’s free to create an account.
                        </p>
                    </div>

                </section>
                <section className="lP-section section3">




                    <div className="lP-card">
                        <Link className="" to="/groups">
                        <img className="lP-card-img" src="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=256"></img>

                            <h3 className="teal-text lP-link  lp-link-title">See fellow Groups</h3>
                        <div className="lp-link-text">
                            <p>Do what you love, meet others who love it, find your community. The rest is history! </p>
                        </div>
                        </Link>
                    </div>






                    <div className="lP-card">
                        <Link className="" to="/events">
                            <img className="lP-card-img" src="https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=256"></img>

                            <h3 className="teal-text lP-link  lp-link-title">Find an Event</h3>
                            <div className="lp-link-text">
                                <p>Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking. </p>
                            </div>
                        </Link>
                    </div>



                    {!user && <div className="lP-card start-card">

                        <img className="lP-card-img" src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=256"></img>
                        {/* to="See all groups" */}

                        <h3 className=" lp-link-title lp-start " >Start a new group</h3>

                        <div className="lp-link-text">
                            <p>You don’t have to be an expert to gather people together and explore shared interests. </p>
                        </div>

                    </div>}




                    {user && <div className="lP-card start-card">
                    <Link className="" to="/groups/new"  >
                        <img className="lP-card-img" src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=256"></img>
                        {/* to="See all groups" */}

                        <h3 className=" lp-link-title lp-start lP-link teal-text" >Start a new group</h3>

                        <div className="lp-link-text">
                            <p>You don’t have to be an expert to gather people together and explore shared interests. </p>
                        </div>
                        </Link>
                    </div>}


                </section>
                <section className="lP-section section4">
                <div className="join-Down cursor">
                <OpenModalMenuItem
             itemText="Join OrganizeDown"
              className='cursor'
              // onButtonClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
            </div>

                </section>
            </div>
        </>
    );
}

export default LandingPage;
