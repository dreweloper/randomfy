import { Navigate, Outlet } from 'react-router-dom';
//TODO: PropTypes
export const PublicRoutes = ({ access_token, refresh_token }) => {

    return (!access_token && !refresh_token) ? <Outlet /> : <Navigate to="/" />

};