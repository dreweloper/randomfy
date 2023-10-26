/**
 * Serializes data into an object.
 * @function serializeData
 * @param {Object} data - The data to be serialized into an object.
 * @throws {Error} Throws an error if the provided data is not a valid object.
 * @returns {Object} An object containing the serialized data.
 */
export const serializeData = (data) => {

    if(!data || typeof data !== 'object') {

        throw new Error('The parameter "data" must be a valid object.');

    };

    const objData = {};
    
    for(const [key, value] of data) {
        
        objData[key] = value;
  
    };

    return objData;

};