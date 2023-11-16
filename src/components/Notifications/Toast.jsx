import { useEffect, useRef, useState } from "react";
import styles from '../../sass/components/Notifications/_Toast.module.scss';
//TODO: PropTypes
export const Toast = ({ text }) => {

    // REACT HOOKS
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Reference to the timer used for auto-closing the toast.
     * @type {React.MutableRefObject<null|Number>}
     */
    const toastRef = useRef(null);

    useEffect(() => {

        if (text) {

            // If the user clicks the 'like' or 'follow' button again while the current timer is still running, the state 'isOpen' is already true.
            if (!isOpen) setIsOpen(true);

            // Clears the existing timer if the user clicks the 'like' or 'follow' button again while the current timer is still running.
            if (toastRef.current) clearTimeout(toastRef.current);

            // Sets a new timer.
            toastRef.current = setTimeout(() => {

                setIsOpen(false);

            }, 4000);

        };

        // Clean up the timer on unmount.
        return () => toastRef.current && clearTimeout(toastRef.current);

    }, [text]);


    return (

        <>

            {
                isOpen && (

                    <article className={styles.container}>

                        <p className={styles.text}>{text}</p>

                    </article>

                )
            }

        </>

    );

};