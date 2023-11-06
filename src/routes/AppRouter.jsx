import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PrivateRoutes, PublicRoutes } from './index.js';
import { HomePage, LoginPage } from '../pages';
import { ACCESS_TOKEN_KEY, CODE_VERIFIER_KEY, REFRESH_TOKEN_KEY, STATE_KEY } from '../utils';

export const AppRouter = () => {

    // REACT-COOKIE HOOK
    const [cookies, setCookie, removeCookie] = useCookies([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]); // Dependencies: cookie names that the components (both private and public routes) depend on or that should trigger a re-render.

    // REACT-ROUTER-DOM HOOK
    const location = useLocation();

    // REACT HOOK
    useEffect(() => {

        if (!location.pathname.includes('login')) {

            // Once the login is successful, the cookie will be removed.
            cookies.spotify_auth_state && removeCookie(STATE_KEY);

            // Once the login is successful, the cookie will be removed.
            cookies.code_verifier && removeCookie(CODE_VERIFIER_KEY);

        };

    }, [location]);


    return (

        <>

            <Routes>

                {/* PRIVATE ROUTES */}
                <Route element={<PrivateRoutes access_token={cookies.access_token} refresh_token={cookies.refresh_token} />}>

                    <Route path="/" element={<HomePage token={cookies.access_token} />} />

                    <Route path="/*" element={<Navigate to="/" />} />

                </Route>

                {/* PUBLIC ROUTES */}
                <Route element={<PublicRoutes access_token={cookies.access_token} refresh_token={cookies.refresh_token} />}>

                    <Route path="login" element={<LoginPage />} />

                    <Route path="/*" element={<Navigate to="login" />} />

                </Route>

            </Routes>

        </>

    );

};