import styles from '../../sass/components/Cards/_UserCard.module.scss';
//TODO: PropTypes
export const UserCard = ({ user }) => {


    return (

        <>

            <div className={styles.card}>

                <div className={`${styles.avatar} ${user.isEmpty && 'skeleton'}`}>

                    {
                        !user.isEmpty && (
                            <img
                                src={user.avatar}
                                alt={`The user profile image of ${user.display_name}`}
                                title={`The user profile image of ${user.display_name}`}
                            />
                        )
                    }

                </div>

                <span className={`${styles.username} ${user.isEmpty && 'skeletonText'}`}>
                    {user.display_name}
                </span>

            </div>

        </>

    );

};