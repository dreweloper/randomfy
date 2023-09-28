import { Routes, Route, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { PrivateRoutes, PublicRoutes } from './index.js';
import { HomePage, LoginPage } from '../pages';

export const AppRouter = () => {

    const [cookies] = useCookies(['access_token']);

    const token = cookies.access_token;


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