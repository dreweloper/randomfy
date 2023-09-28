import { Navigate, Outlet } from 'react-router-dom';
//TODO: PropTypes
export const PrivateRoutes = ({ token }) => {

    return (token.access_token || token.refresh_token) ? <Outlet /> : <Navigate to="login" />

};