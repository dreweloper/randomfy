import { useState } from 'react';
import { useSelector } from 'react-redux';
import { UserCard } from '../components';
import { useAuth } from '../hooks';
import styles from '../sass/layouts/_NavBar.module.scss';

export const NavBar = () => {

    // REACT HOOK
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // REACT-REDUX HOOK
    const user = useSelector(state => state.user);

    // CUSTOM HOOK
    const { logout } = useAuth();

    // EVENT
    /**
     * Toggles the state between open and closed.
     * @function handleToggle
     */
    const handleToggle = () => setIsMenuOpen(prevState => !prevState);


    return (

        <>

            <nav className={styles.nav}>

                {/* This wrapper is the key to enabling the slide-in and slide-out transition of the menu ('z-index'). */}
                <div className={styles.wrapper}>

                    <div className={styles.logo}>

                        {/* IMG */}
                        <span>RANDOMFY</span>

                    </div>

                    <div className={styles.container}>

                        {
                            user.isLogged && <UserCard user={user} />
                        }

                        {/* NON DESKTOP MENU BUTTON */}
                        <button
                            className={styles.menuBtn}
                            onClick={handleToggle}>

                            <span className={`${styles.menuIcon} material-symbols-rounded`}>
                                {isMenuOpen ? 'expand_less' : 'expand_more'}
                            </span>

                        </button>

                        {/* DESKTOP LOGOUT BUTTON */}
                        <button className={styles.outlinedBtn} onClick={logout}>Logout</button>

                    </div>

                    <ul className={`${styles.menu} ${isMenuOpen && styles.menuExpanded}`}>

                        <li className={styles.item}>

                            <button className={styles.solidBtn} onClick={logout}>

                                <span className={`${styles.logoutIcon} material-symbols-rounded`}>
                                    logout
                                </span>

                                <span className={styles.text}>Logout</span>

                            </button>

                        </li>

                    </ul>

                </div>

            </nav>

        </>

    );

};