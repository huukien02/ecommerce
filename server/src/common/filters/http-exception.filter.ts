import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const timestamp = new Date().toISOString();
        const path = request.url;

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();

            const res: any = exception.getResponse();

            message =
                res?.message ||
                res ||
                exception.message ||
                'Something went wrong';
        }

        response.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
            timestamp,
            path,
        });
    }
}