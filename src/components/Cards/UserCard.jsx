import { useSelector } from 'react-redux';
import { Image } from '../Assets';
import { Spinner } from '../Loading';
import { STATUS } from '../../utils';
import styles from '../../sass/components/_UserCard.module.scss';
import { Overlay } from '../../layouts';
//TODO: PropTypes
export const UserCard = ({ user }) => {

    // REACT-REDUX HOOK
    const status = useSelector(state => state.process.status);


    return (

        <>

            <div className={styles.card}>

                <Image
                    className={styles.avatar}
                    description={`The user profile image of ${user.display_name}`}
                    source={!user.isEmpty ? user.avatar : 'Fake avatar src'}
                />

                <span className={styles.username}>

                    {!user.isEmpty ? user.display_name : status === STATUS.LOADING ? 'Loading…' : user.isError && 'Error'}
                    
                </span>

            </div>

            {
                user.isEmpty && (

                    <Overlay>

                        {/* {user.isError && (<Alert />)} –display a notification to indicate the error and (perhaps) provide an option to reload the call or refresh the page– */}

                        {status === STATUS.LOADING && (<Spinner />)}

                    </Overlay>

                )
            }

        </>

    );

};