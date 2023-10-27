import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spinner } from '../components';
import { useAuth } from '../hooks';
import { Footer, Overlay } from '../layouts';
import { STATUS } from '../utils';

export const LoginPage = () => {

  // REACT-ROUTER-DOM HOOK
  const [searchParams, setSearchParams] = useSearchParams();

  // CUSTOM HOOK
  const { status, handleUserAuthResponse, requestUserAuth } = useAuth();

  // REACT HOOK
  useEffect(() => {

    /**
     * Search params are not empty. It indicates that the user has clicked the login button.
     * Once the user accepts or denied the requested permissions, the OAuth service redirects the user back to the URL specified in the 'redirect_uri' field ('/login').
     */
    if (searchParams.size > 0) handleUserAuthResponse(searchParams);

    return () => {

      // Clear the URL search params if they are not empty.
      if (searchParams.size > 0) setSearchParams();

    };

  }, [searchParams]);


  return (

    <>

      <main className='main'>

        <section className='hero'>

          <div className='container'>

            <h1 className='title'>Randomfy: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta, quia!</h1>

            <p className='description'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus labore ratione quae soluta quidem corrupti similique eaque facere magni voluptates.</p>

          </div>

          <button
            className='login'
            onClick={requestUserAuth}
            disabled={status === STATUS.LOADING}
          >
            LOGIN
          </button>

          {
            status === STATUS.LOADING ? (

              <Overlay>

                <Spinner />

              </Overlay>

            ) : (

              status === STATUS.FAILED && <p>Access denied. Please try again.</p>

            )

          }

        </section>

      </main>

      <Footer />

    </>

  );

};