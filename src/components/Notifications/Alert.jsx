import { useEffect, useState } from 'react';
import { Overlay } from '../../layouts';
import styles from '../../sass/components/Notifications/_Alert.module.scss';

export const Alert = ({ text }) => {

    // REACT HOOKS
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    useEffect(() => {

        setIsAlertOpen(true);

        return () => {

            if (isAlertOpen) setIsAlertOpen(false);

        };

    }, [text]);


    return (

        <>

            {
                isAlertOpen && (

                    <Overlay>

                        <article className={styles.alert}>

                            <button className={styles.button} onClick={() => setIsAlertOpen(false)}>

                                <span className={`${styles.icon} material-symbols-rounded`}>
                                    close
                                </span>

                            </button>

                            <p className={styles.text}>{text}</p>

                        </article>

                    </Overlay>

                )
            }

        </>

    );

};