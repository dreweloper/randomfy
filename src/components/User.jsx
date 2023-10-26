//TODO: PropTypes
export const User = ({ user }) => {


    return (

        //TODO: use the 'status' property in the 'process' Redux state to prevent loading other components in case of an error.

        <>

            {
                user.isLoading ? (

                    // OVERLAY
                    <span>SPINNER</span>

                ) : (

                    user.isError ? (

                        //TODO: Alert. Display a notification to indicate the error and (perhaps) provide an option to reload the call or refresh the page.
                        //? Display a fake avatar (and display name?) or skeleton loader in case of an error.
                        <span>ERROR!</span>

                    ) : (

                        !user.isEmpty && (

                            <div className='userCard'>

                                <div className='avatar'>

                                    <img src={user.avatar} alt="User's profile image" title="User's profile image" />

                                </div>

                                <span className="displayName">{user.display_name}</span>

                            </div>

                        )

                    )

                )

            }

        </>

    );

};