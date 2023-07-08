import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import OrganizeDown from './OrganizeDown.png'
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import OpenModalButton from '../OpenModalButton';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='nav-div'>

      <NavLink exact to="/"><img className='logo' src={OrganizeDown}></img></NavLink>

      {isLoaded && (
        <div className='right-nav'>
          {!sessionUser && <>
            <div className='cursor'>
              <OpenModalMenuItem
                itemText="Log In"

                // onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </div>

            <OpenModalButton
              buttonText="Sign Up"
              className='cursor'
              // onButtonClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>}
          {sessionUser &&
            <>
              <Link to="/groups/new"><h3 className='teal-text'>Start a new group</h3></Link>
              <div className='profile-div'>

                <ProfileButton user={sessionUser} />
              </div>
            </>}

        </div>
      )}
    </div>
  );
}

export default Navigation;
