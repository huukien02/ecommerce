import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();

        return next.handle().pipe(
            map((data) => {
                const timestamp = new Date().toISOString();
                const path = request.url;

                // 👉 custom message support
                const message = data?.message || 'OK';
                const payload = data?.data ?? data;

                // 👉 pagination detect
                if (payload?.data && payload?.total !== undefined) {
                    return {
                        status: 'success',
                        statusCode: 200,
                        message,
                        timestamp,
                        path,
                        data: {
                            items: payload.data,
                            total: payload.total,
                            page: payload.page,
                            limit: payload.limit,
                            totalPages: payload.totalPages,
                        },
                    };
                }

                return {
                    status: 'success',
                    statusCode: 200,
                    message,
                    timestamp,
                    path,
                    data: payload,
                };
            }),
        );
    }
}