import React from 'react';

import { useSelector } from 'react-redux';

import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <>
        
    </>
  );
}

export default Navigation;
