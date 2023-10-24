
export const Button = ({ children, disabled, onClick }) => {


    return (

        <button onClick={onClick} disabled={disabled}>

            {children}

        </button>

    );

};