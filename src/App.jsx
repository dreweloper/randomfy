import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function App () {

  const [query, setQuery] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    
    // At least 1 query
    if (searchParams.size > 1) {

      setIsLoading(true);

      const params = {};

      for (const [key, value] of searchParams) {
        
        params[key] = value;

      };

      if (params.error) {

        setError(params);

        setIsLoading(false);

      } else {

        setQuery(params);

      };

    };
  
    return () => {

      setSearchParams()
      
    };

  }, [searchParams]);
  

  return (

    <>
      <h1>Randomfy</h1>

      <Link to='http://localhost:3000/api/login'>LogIn Spotify</Link>

      {
        isLoading && <p>Loading…</p>
      }

      {
        error && <p>Access denied!</p>
      }

    </>

  );

};

export default App;
