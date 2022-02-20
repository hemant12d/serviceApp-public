// mode = 1 // increment
// mode = 0 // decrement

/**
 * 
 * @param {String} queryUrl 
 * @param {Integer} pageValue 
 * @param {Integer} mode 
 * @returns 
 */

const pageHandler = (queryUrl, pageValue, mode=1)=>{
    let updatedQueryUrl;

    if(mode)
        updatedQueryUrl = queryUrl.replace(`page=${pageValue}`, `page=${pageValue + 1}`)
    else
        updatedQueryUrl = queryUrl.replace(`page=${pageValue}`, `page=${pageValue - 1}`)

    return updatedQueryUrl;

}

export default pageHandler;