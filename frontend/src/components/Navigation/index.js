import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import  OrganizeDown from './OrganizeDown.png'

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='nav-div'>

        <NavLink  exact to="/"><img className='logo' src={OrganizeDown}></img></NavLink>

      {isLoaded &&  (
        <div className='right-nav'>
         {!sessionUser && <>
          <p>login</p>
          <p>signup</p>
         </>}
         {sessionUser &&  <ProfileButton user={sessionUser} />}

        </div>
      )}
</div>
  );
}

export default Navigation;
