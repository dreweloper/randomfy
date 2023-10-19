import { Navigate, Outlet } from 'react-router-dom';
//TODO: PropTypes
export const PrivateRoutes = ({ access_token, refresh_token }) => {

    return (access_token || refresh_token) ? <Outlet /> : <Navigate to="login" />

};