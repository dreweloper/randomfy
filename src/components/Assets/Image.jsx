
export const Image = ({ className, description, source }) => {


    return (

        <div className={className}>

            <img src={source} alt={description} title={description} width='200' />

        </div>

    );

};