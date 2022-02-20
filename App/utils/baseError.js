class baseError extends Error{

    constructor(message, statusCode, key = null){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        if(key){
            this.error = {};
            this.error[key] = this.message;
            this.message = this.error;
        }
        else{
            this.message = {message: this.message}
        }
        
        Error.captureStackTrace(this, this.constructor)
    }
}


export default baseError;