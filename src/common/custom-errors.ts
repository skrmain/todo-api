enum HttpStatus {
    INVALID = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
}

export class HttpError extends Error {
    public errorDetail?: object;
    constructor(message: string, public status: HttpStatus) {
        super(message);
    }
}

export class InvalidHttpRequestError extends HttpError {
    constructor(message: string, public errorDetail?: object) {
        super(message, HttpStatus.INVALID);
    }
}

export class UnauthorizedHttpRequestError extends HttpError {
    constructor(message: string) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}

export class ForbiddenHttpRequestError extends HttpError {
    constructor(message: string) {
        super(message, HttpStatus.FORBIDDEN);
    }
}

export class NotFoundHttpRequestError extends HttpError {
    constructor(message: string) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
