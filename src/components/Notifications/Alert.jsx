import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Overlay } from '../../layouts';
import { STATUS } from '../../utils';
import styles from '../../sass/components/Notifications/_Alert.module.scss';

export const Alert = () => {

    // REACT HOOK
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    // REACT-REDUX HOOK
    const { status, message } = useSelector(state => state.process);

    useEffect(() => {

        if (status === STATUS.FAILED) setIsAlertOpen(true);

        return () => {

            if (isAlertOpen) setIsAlertOpen(false);

            //? Reset process state…

        };

    }, [status]);


    return (

        <>

            {
                isAlertOpen && (

                    <Overlay>

                        <article className={styles.alert}>

                            <section className={styles.container}>

                                <span className={`${styles.errorIcon} material-symbols-rounded`}>
                                    error
                                </span>

                                <p className={styles.text}>{message}</p>

                            </section>

                            <button
                                className={styles.button}
                                onClick={() => setIsAlertOpen(false)}
                            >

                                <span className={`${styles.closeIcon} material-symbols-rounded`}>
                                    close
                                </span>

                            </button>

                        </article>

                    </Overlay>

                )
            }

        </>

    );

};