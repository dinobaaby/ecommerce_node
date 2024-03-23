'use strict';

const { ReasonPhrases, StatusCodes } = require("./httpStatusCode");

const StatusCode = {
    FORBIDDEN: 403,
    COFLICT: 409
}

const ResponseStatusCode = {
    FORBIDDEN: 'Bad request error',
    COFLICT: 'Conflict error'
}


class ErrorResponse extends Error{
    constructor(message,status){
        super(message)
        this.status = status
    }

}


class ConflictRequestError extends ErrorResponse{
    constructor(message = ResponseStatusCode.COFLICT, statusCode = StatusCode.FORBIDDEN){
        super(message, statusCode)
    }
}


class BadRequestError extends ErrorResponse{
    constructor(message = ResponseStatusCode.COFLICT, statusCode = StatusCode.FORBIDDEN){
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorResponse{
    constructor(message = "AuthFailureError", statusCode = 400){
        super(message, statusCode)
    }
}

class AuthNotFound extends ErrorResponse{
    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND){
        super(message, statusCode)
    }
}

class ForbiddenError extends ErrorResponse{
    constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN){
        super(message, statusCode)
    }
}




module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    AuthNotFound,
    ForbiddenError
}