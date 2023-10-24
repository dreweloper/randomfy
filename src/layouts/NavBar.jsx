import { User } from "../components";
import { TextButton } from "../components/buttons";
import { useAuth } from "../hooks";

export const NavBar = () => {

    const { logout } = useAuth();


    return (

        <nav>

            <User />

            <TextButton onClick={logout}>
                Logout
            </TextButton>

        </nav>

    );

};