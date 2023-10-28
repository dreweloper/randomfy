import { useState } from 'react';
import { useSelector } from 'react-redux';
import { UserCard } from '../components';
import { useAuth } from "../hooks";

export const NavBar = () => {

    // REACT HOOK
    const [isOpen, setIsOpen] = useState(false);

    // REACT-REDUX HOOK
    const user = useSelector(state => state.user);

    // CUSTOM HOOK
    const { logout } = useAuth();

    // EVENT
    /**
     * Toggles the state between open and closed.
     * @function handleToggle
     */
    const handleToggle = () => setIsOpen(prevState => !prevState); //!FUNC-HANDLETOGGLE


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