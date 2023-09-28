import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

export const HomePage = () => {

    const [user, setUser] = useState({});

    const [cookies] = useCookies([]);
    const token = cookies.access_token;

    const getUserProfile = async () => {

        const SPOTIFY_BASE_URL = 'https://api.spotify.com';

        const fetchOptions = { headers: { Authorization: `Bearer ${token}` } };

        try {

            const response = await fetch(`${SPOTIFY_BASE_URL}/v1/me`, fetchOptions);

            if (response.ok) {

                const data = await response.json();

                setUser(data);

            };

        } catch (error) {

            console.error(error.message);

        };

    };

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