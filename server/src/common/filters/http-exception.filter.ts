import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger('Exception');

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

        this.logger.error(`${request.method} ${path} ${statusCode} - ${message}`);

        response.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
            timestamp,
            path,
        });
    }
}