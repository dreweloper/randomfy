import { User } from "../components";
import { useAuth } from "../hooks";

export const NavBar = () => {

    const { handleLogout } = useAuth();


    return (

        <nav>

            <User />

            <button onClick={handleLogout}>Logout</button>

        </nav>

    );

};