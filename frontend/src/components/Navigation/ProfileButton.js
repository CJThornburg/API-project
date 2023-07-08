import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import OpenModalMenuItem from './OpenModalMenuItem';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.thunkLogout());
        closeMenu();
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>

            <i className="fas fa-user-circle login-icon profile-but cursor" onClick={openMenu} />
            {showMenu && <i class="fas fa-solid fa-angle-up"></i>}
            {!showMenu && <i class="fas fa-solid fa-angle-down"></i>}

            <ul className={ulClassName} ref={ulRef}>
                {user ? (
                    <>
                        <div className="pop-up-div">
                            <li className="pop-item">Hello, {user.firstName}</li>
                            <li className="pop-item">{user.email}</li>
                            <hr className="popHr"></hr>
                            <li onClick={logout} className="cursor pop-item pop-bottom">Log Out

                            </li>
                        </div>
                    </>
                ) : (
                    <>
                        <li>
                            <OpenModalMenuItem
                                itemText="Log In"
                                onItemClick={closeMenu}
                                modalComponent={<LoginFormModal />}
                            />
                        </li>
                        <li>
                            <OpenModalButton
                                buttonText="Sign Up"
                                onButtonClick={closeMenu}
                                modalComponent={<SignupFormModal />}
                            />
                        </li>
                    </>
                )}
            </ul>
        </>
    );
}

export default ProfileButton;
