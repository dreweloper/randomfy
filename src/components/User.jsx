import { useUserStore } from "../hooks";
import { STATUS } from "../utils";

export const User = () => {

    // CUSTOM HOOK
    const { userStatus, user: { display_name, id, image_url } } = useUserStore();


    return (

        <>

            {
                userStatus === STATUS.LOADING && (
                    <p>Loading…</p>
                )
            }

            {
                userStatus === STATUS.FAILED && (
                    <p>Failed to obtain user's profile</p>
                )
            }

            {
                userStatus === STATUS.SUCCEEDED && (
                    <div id={id}>

                        <img src={image_url} alt="User's profile image" title="User's profile image" />

                        <h3>{display_name}</h3>

                    </div>
                )
            }

        </>

    );

};