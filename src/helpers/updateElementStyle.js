/**
 * Updates the style property of an HTML element.
 * 
 * @function updateElementStyle
 * @param {HTMLElement} element - The HTML element to update.
 * @param {string} propName - The name of the CSS property to update.
 * @param {string} propValue - The value to set for the CSS property.
 */
export const updateElementStyle = (element, propName, propValue) => {
  
    element.style.setProperty(propName, propValue);
    
};