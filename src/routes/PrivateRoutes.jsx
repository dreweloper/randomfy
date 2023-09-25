import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoutes = ({ token }) => {

    return token ? <Outlet /> : <Navigate to="/login" />

};