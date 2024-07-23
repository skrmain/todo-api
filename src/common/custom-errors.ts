enum HttpStatus {
    INVALID = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
}

export class HttpError extends Error {
    status: HttpStatus;
    errorDetail: object | undefined;
    constructor(message: string, status: HttpStatus) {
        super(message);
        this.status = status;
    }
}

export class InvalidHttpRequestError extends HttpError {
    constructor(message: string, errorDetail?: object) {
        super(message, HttpStatus.INVALID);
        this.errorDetail = errorDetail;
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
