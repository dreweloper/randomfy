import { useUserStore } from "../hooks";
import { STATUS } from "../utils";

export const User = () => {

    // CUSTOM HOOK
    const { status, user: { display_name, id, image_url } } = useUserStore();


    return (

        <>

            {
                status === STATUS.LOADING && (
                    <p>Loading…</p>
                )
            }

            {
                status === STATUS.FAILED && (
                    <p>Failed to obtain user's profile</p>
                )
            }

            {
                status === STATUS.SUCCEEDED && (
                    <div id={id}>

                        <img src={image_url} alt="User's profile image" title="User's profile image" />

                        <h3>{display_name}</h3>

                    </div>
                )
            }

        </>

    );

};