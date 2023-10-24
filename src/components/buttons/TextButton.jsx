
export const TextButton = ({ children, disabled, onClick }) => {


  return (

    <button onClick={onClick} disabled={disabled}>

        {children}
        
    </button>

  );

};