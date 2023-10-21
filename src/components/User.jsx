import { useUserStore } from "../hooks";

export const User = () => {

    // CUSTOM HOOK
    const { user } = useUserStore();


    return (

        <>

            {
                user.isLoading && <p>Loading…</p>
            }

            {
                user.isError && <p>Failed to obtain user's profile</p>
            }

            {
                !user.isEmpty && (
                    <div id={user.id}>

                        <img src={user.avatar} alt="User's profile image" title="User's profile image" />

                        <h3>{user.display_name}</h3>

                    </div>
                )
            }

        </>

    );

};