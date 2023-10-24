import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { DisplayTrack } from '../components';
import { NavBar } from '../layouts';
import { CODE_VERIFIER_KEY, STATE_KEY } from '../utils';

export const HomePage = () => {

    // REACT-COOKIE HOOK
    const [cookies, setCookie, removeCookie] = useCookies([STATE_KEY, CODE_VERIFIER_KEY]); // Dependencies: cookie names that the component depend on or that should trigger a re-render.

    // REACT HOOKS
    useEffect(() => {

        // Removes the cookie after the login is successful.
        if (cookies.spotify_auth_state) removeCookie(STATE_KEY);

        // Removes the cookie after the login is successful.
        if (cookies.code_verifier) removeCookie(CODE_VERIFIER_KEY);

    }, []);


    return (

        <>

            <NavBar />

            <main>
                
                <DisplayTrack />
                
            </main>

        </>

    );

};