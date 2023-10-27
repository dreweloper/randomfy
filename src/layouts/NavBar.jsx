import { useState } from 'react';
import { UserCard } from '../components/Cards';
import { useAuth, useUserStore } from "../hooks";

export const NavBar = () => {

    // REACT HOOK
    const [isOpen, setIsOpen] = useState(false);

    // CUSTOM HOOKS
    const { logout } = useAuth();

    const { user } = useUserStore();

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