
export const Toast = ({ text, type }) => {


    return (

        <div className='toast'>

            <p className={type}>{text}</p>

        </div>

    );

};