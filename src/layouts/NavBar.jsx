import { useState } from 'react';
import { UserCard } from '../components';
import { useAuth } from "../hooks";
import { useSelector } from 'react-redux';

export const NavBar = () => {

    // REACT HOOK
    const [isOpen, setIsOpen] = useState(false);

    // REACT-REDUX HOOK
    const user = useSelector(state => state.user);

    // CUSTOM HOOK
    const { logout } = useAuth();

    // EVENT
    const handleToggle = () => setIsOpen(prevState => !prevState);


    return (

        <nav>

            <div className="logo">

                {/* IMG */}
                <span>RANDOMFY LOGO</span>

            </div>

            <div className="container">

                <UserCard user={user} />

                <button onClick={handleToggle}>

                    <span className="material-symbols-rounded">
                        menu
                    </span>

                </button>

                {
                    isOpen && (

                        <ul className="menuList">

                            <li className="menuItem">

                                {/* TEXT BUTTON */}
                                <button onClick={logout}>

                                    <span>LOGOUT</span>

                                    <span className="material-symbols-rounded">
                                        logout
                                    </span>

                                </button>

                            </li>

                        </ul>

                    )
                }

            </div>

        </nav>

    );

};