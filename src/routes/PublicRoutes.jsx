import { Navigate, Outlet } from 'react-router-dom';
//TODO: PropTypes
export const PublicRoutes = ({ token }) => {

    return (!token.access_token && !token.refresh_token) ? <Outlet /> : <Navigate to="/" />

};