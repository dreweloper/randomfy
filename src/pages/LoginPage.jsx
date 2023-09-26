import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks';
import * as authConst from '../utils/consts.js';
import queryString from 'query-string';

export const LoginPage = () => {
  
  const loginUrl = queryString.stringifyUrl({
    url: `${authConst.URL_BASE}/login`,
    query: {
      redirect_uri: authConst.REDIRECT_URI,
      scope: authConst.SCOPE,
      stateKey: authConst.STATE_KEY
    }
  });
  
    // REACT-ROUTER-DOM HOOK
    const [searchParams, setSearchParams] = useSearchParams();

    // CUSTOM HOOK
    const { handleUserAuthResponse, isLoading, isAuthError } = useAuth(searchParams);

    // REACT HOOK
    useEffect(() => {

      const searchParamsIsNotEmpty = searchParams.size > 0;

      if(searchParamsIsNotEmpty) handleUserAuthResponse(searchParams);

      return () => {

        if(searchParamsIsNotEmpty) setSearchParams();

      };

    }, [searchParams]);
    
  
    return (
  
      <>
      
        <h1>Randomfy</h1>
  
        <Link to={loginUrl}>Login Spotify</Link>
  
        {
          isLoading && <p>Loading…</p>
        }
  
        {
          isAuthError && <p>Access denied!</p>
        }
  
      </>
  
    );
  
};