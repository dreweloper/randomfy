import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useUserStore } from '../hooks';

export const HomePage = () => {

    // REACT-REDUX HOOK
    const { user } = useSelector(state => state.user);

    // CUSTOM HOOK
    const { getUserProfile } = useUserStore();

    // REACT HOOK
    useEffect(() => {

        getUserProfile();

    }, []);


    return (

        <>

            <h2>¡Bienvenido, {user?.display_name}!</h2>

            <img src={user.images?.[1].url} alt='User avatar' title='User avatar' />

        </>

    );

};