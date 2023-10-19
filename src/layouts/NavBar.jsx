import { User } from "../components";
import { useAuth } from "../hooks";

export const NavBar = () => {

    const { logout } = useAuth();


    return (

        <nav>

            <User />

            <button onClick={logout}>Logout</button>

        </nav>

    );

};