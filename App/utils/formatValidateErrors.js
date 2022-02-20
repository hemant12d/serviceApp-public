const formatValidateErrors = function(error){
    let formatedErrors = {};
    let errors = error.errors;

    for(let key in errors){
      formatedErrors[key] = errors[key].message;
    }

    return formatedErrors;
}


export default formatValidateErrors;
