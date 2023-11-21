import { useCookies } from 'react-cookie';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoutes, PublicRoutes } from './index.js';
import { HomePage, LoginPage } from '../pages';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils';

export const AppRouter = () => {

    // REACT-COOKIE HOOK
    const [cookies] = useCookies([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]); // Dependencies: cookie names that the components (both private and public routes) depend on or that should trigger a re-render.


    return (

        <>

            <Routes>

                {/* PRIVATE ROUTES */}
                <Route element={<PrivateRoutes access_token={cookies?.access_token} refresh_token={cookies?.refresh_token} />}>

                    <Route path="/" element={<HomePage token={cookies?.access_token} />} />

                    <Route path="/*" element={<Navigate to="/" />} />

                </Route>

                {/* PUBLIC ROUTES */}
                <Route element={<PublicRoutes access_token={cookies?.access_token} refresh_token={cookies?.refresh_token} />}>

                    <Route path="login" element={<LoginPage />} />

                    <Route path="/*" element={<Navigate to="login" />} />

                </Route>

            </Routes>

        </>

    );

};