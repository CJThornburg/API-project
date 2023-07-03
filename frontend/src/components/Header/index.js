import React from 'react';

import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import './Header.css'

function Header({ active }) {
   


    return (
        <>
            <div>
                <div className="header-links">
                    <h2 className="header-link" >
                        <Link to="/events" className={active === "Events" ? 'header-active' : "header-un-active"}>Events</Link>
                    </h2>
                    <h2 className="header-link">
                        <Link to="/groups" className={active === "Groups" ? 'header-active' : "header-un-active"}>Groups</Link>
                    </h2>
                </div>
                <div>
                    {active} in OrganizeDown
                </div>
            </div>
        </>
    );
}

export default Header;
