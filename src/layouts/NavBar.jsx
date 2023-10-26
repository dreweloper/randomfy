import { TextButton, User } from "../components";
import { useAuth, useUserStore } from "../hooks";

export const NavBar = () => {

    // CUSTOM HOOKS
    const { requestUserAuth, logout } = useAuth();

    const { user } = useUserStore();


    return (

        <nav>

            <div className="logo">

                {/* IMG */}
                <span>RANDOMFY LOGO</span>

            </div>

            <div className="container">

                <User user={user} />

                {/* INSERT MENU BUTTON */}

                <ul className="menuList">

                    <li className="menuItem">

                        <TextButton
                            //TODO: user.isLogged ?
                            onClick={user.isEmpty ? requestUserAuth : logout}
                        >

                            {/* user.isLogged ? LOGOUT : LOGIN */}
                            {user.isEmpty ? 'LOGIN' : 'LOGOUT'}

                        </TextButton>

                    </li>

                </ul>

            </div>

        </nav>

    );

};