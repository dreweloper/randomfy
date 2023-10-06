import { Routes, Route, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { PrivateRoutes, PublicRoutes } from './index.js';
import { HomePage, LoginPage } from '../pages';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils';

export const AppRouter = () => {

    // REACT-COOKIE HOOK
    const [cookies] = useCookies([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]); // Dependencies (optional): cookie name(s) that the component (PrivateRoutes) depend on or that should trigger a re-render

    const token = { access_token: cookies.access_token, refresh_token: cookies.refresh_token };


    return (

        <>

            <Routes>

                {/* PRIVATE ROUTES */}
                <Route element={<PrivateRoutes token={token} />}>

                    <Route path="/" element={<HomePage />} />

                    <Route path="/*" element={<Navigate to="/" />} />

                </Route>

                {/* PUBLIC ROUTES */}
                <Route element={<PublicRoutes token={token} />}>

                    <Route path="login" element={<LoginPage />} />

                    <Route path="/*" element={<Navigate to="login" />} />

                </Route>

            </Routes>

        </>

    );

};