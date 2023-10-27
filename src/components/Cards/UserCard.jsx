import { Overlay } from '../../layouts';
//TODO: PropTypes
export const UserCard = ({ user }) => {


    return (

        //TODO: use the 'status' property in the 'process' Redux state to prevent loading other components in case of an error.

        <>

            {
                user.isLoading ? (

                    <Overlay>

                        <span>SPINNER LOADER</span>

                    </Overlay>

                ) : (

                    user.isError ? (

                        //TODO: Alert. Display a notification to indicate the error and (perhaps) provide an option to reload the call or refresh the page.
                        //? Display a fake avatar (and display name?) or skeleton loader in case of an error.
                        <p>ERROR</p>

                    ) : (

                        !user.isEmpty && (

                            <div className='userCard'>

                                <div className='avatar'>

                                    <img src={user.avatar} alt="User's profile image" title="User's profile image" />

                                </div>

                                <span className="username">{user.display_name}</span>

                            </div>

                        )

                    )

                )

            }

        </>

    );

};