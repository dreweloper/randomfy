import { Navigate, Outlet } from 'react-router-dom';

export const PublicRoutes = ({ token }) => {

    return !token ? <Outlet /> : <Navigate to="/" />

};