import { useEffect, useRef } from 'react';
import { updateElementStyle } from '../../helpers';
import styles from '../../sass/components/Loading/_Spinner.module.scss';

export const Spinner = ({ size, color }) => {

    // REACT HOOKS
    const spinnerRef = useRef();

    useEffect(() => {

        // Default values are set for 'size' and 'color' in Scss, but they are both customizable.

        if (size) updateElementStyle(spinnerRef.current, '--spinner-size', size);

        if (color) updateElementStyle(spinnerRef.current, '--border-left-clr', color);

    }, []);


    return (

        <span className={styles.spinner} ref={spinnerRef}></span>

    );

};