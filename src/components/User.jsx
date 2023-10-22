import { useUserStore } from "../hooks";

export const User = () => {

    // CUSTOM HOOK
    const { user } = useUserStore();


    return (

        //TODO: use the 'status' property in the 'process' Redux state to prevent loading other components in case of an error.

        <>

            {
                user.isLoading ? (

                    <p>Loading…</p>

                ) : (

                    user.isError ? (

                        //TODO: display a toast notification to indicate the error and provide an option to reload the call or refresh the page (?).
                        //? Display a fake avatar or skeleton loader in case of an error.
                        <p>ERROR!</p>

                    ) : (

                        !user.isEmpty && (

                            <div id={user.id}>

                                <img src={user.avatar} alt="User's profile image" title="User's profile image" />

                                <h3>{user.display_name}</h3>

                            </div>

                        )

                    )

                )

            }

        </>

    );

};