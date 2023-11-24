import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Spinner } from '../components';
import { useAuth } from '../hooks';
import { Footer, NavBar, Overlay } from '../layouts';
import { STATUS } from '../utils';
import styles from '../sass/pages/_LoginPage.module.scss';

export const LoginPage = () => {

  // REACT HOOK
  /**
   * Used to track whether the login callback has been handled to prevent multiple calls.
   * @type {React.MutableRefObject<Boolean>}
   */
  const isHandled = useRef(false);

  // REACT-REDUX HOOK
  const status = useSelector(state => state.process.status);

  // CUSTOM HOOK
  const { searchParams, handleUserAuthResponse, requestUserAuth } = useAuth();

  // REACT HOOK
  useEffect(() => {

    /**
     * If search params are not empty, it indicates that the user has clicked the login button.
     * 
     * When the user accepts or denies the requested permissions, the OAuth service redirects the user back to the URL specified in the 'redirect_uri' field ('/login').
     * The callback contains two query parameters: 'code' (if accepted) or 'error' (if denied) and 'state'.
     */
    if (searchParams.toString().length > 0 && !isHandled.current) {

      isHandled.current = true;

      handleUserAuthResponse();

    };

  }, []);


  return (

    <>

      <NavBar />

      <main className={styles.main}>

        <section className={styles.hero}>

          <article className={styles.container}>

            <h1 className={styles.title}>Find your next <span className={styles.favorite}>favorite</span> song</h1>

            <p className={styles.description}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus labore ratione quae soluta quidem corrupti similique eaque facere magni voluptates.</p>

          </article>

          <button
            className={styles.loginBtn}
            onClick={requestUserAuth}
            disabled={status === STATUS.LOADING}
          >
            Login with Spotify
          </button>

        </section>

        {
          status === STATUS.LOADING ? (

            <Overlay>

              <Spinner size={'48px'} color={'#1db954'} /> {/* Accent color */}

            </Overlay>

          ) : (

            status === STATUS.FAILED && (<Alert />)

          )
        }

      </main>

      <Footer />

    </>

  );

};