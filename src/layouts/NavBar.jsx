import { useState } from 'react';
import { useSelector } from 'react-redux';
import { UserCard } from '../components';
import { useAuth } from '../hooks';
import styles from '../sass/layouts/_NavBar.module.scss';

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

        <nav className={styles.nav}>

            <div className={styles.logo}>

                {/* IMG */}
                <span>RANDOMFY</span>

            </div>

            <div className={styles.container}>

                <UserCard user={user} />

                <button
                    className={styles.menuBtn}
                    onClick={handleToggle}>

                    <span className={`${styles.menuIcon} material-symbols-rounded`}>
                        expand_more
                    </span>

                </button>

                {
                    isOpen && (

                        <ul className={styles.list}>

                            <li className={styles.item}>

                                {/* ICON + TEXT BUTTON */}
                                <button className={styles.logoutBtn} onClick={logout}>

                                    <span className={`${styles.logoutIcon} material-symbols-rounded`}>
                                        logout
                                    </span>

                                    <span className={styles.text}>Logout</span>

                                </button>

                            </li>

                        </ul>

                    )
                }

            </div>

        </nav>

    );

};