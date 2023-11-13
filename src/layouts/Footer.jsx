import { Link } from 'react-router-dom';
import styles from '../sass/layouts/_Footer.module.scss';

export const Footer = () => {


    return (

        <footer className={styles.footer}>

            <nav className={styles.nav}>

                <Link
                    className={styles.link}
                    to='https://github.com/dreweloper'
                    target='_blank'
                >

                    <i className={`${styles.logo} devicon-github-original`}></i>

                </Link>

                <Link
                    className={styles.link}
                    to='https://www.linkedin.com/in/andres-leon-developer'
                    target='_blank'
                >

                    <i className={`${styles.logo} devicon-linkedin-plain`}></i>

                </Link>

            </nav>

            <p className={styles.text}>© 2023. A project by <strong>Andrés León</strong></p>

        </footer>

    );

};