import { Image } from '../Assets';
import { Spinner } from '../Loading';
import { Overlay } from '../../layouts';
import styles from '../../sass/components/_UserCard.module.scss';
//TODO: PropTypes
export const UserCard = ({ user }) => {


    return (

        //TODO: use the 'status' property in the 'process' Redux state to prevent loading other components in case of an error.

        <>

            {
                user.isLoading ? (

                    <Overlay>

                        <Spinner />

                    </Overlay>

                ) : (

                    user.isError ? (

                        //TODO: Alert. Display a notification to indicate the error and (perhaps) provide an option to reload the call or refresh the page.
                        //? Display a fake avatar (and display name?) or skeleton loader in case of an error.
                        <p>ERROR</p>

                    ) : (

                        !user.isEmpty && (

                            <div className={styles.card}>

                                <Image
                                    className={styles.avatar}
                                    description={`The user profile image of ${user.display_name}`}
                                    source={user.avatar}
                                />

                                <span className={styles.username}>{user.display_name}</span>

                            </div>

                        )
                    )
                )
            }

        </>

    );

};