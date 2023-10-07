import { useAuth } from "../hooks";

export const NavBar = () => {

    const { handleLogout } = useAuth();


    return (

        <nav>

            <button onClick={handleLogout}>Logout</button>

        </nav>

    );

};