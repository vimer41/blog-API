import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class CatchAllHttpExecption implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? (exception.getResponse() as any)
        : null;

    const message =
      exception instanceof HttpException
        ? exceptionResponse.error
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const details = exceptionResponse?.message || null;

    const error =
      exceptionResponse?.error ||
      (exception instanceof HttpException ? exception.name : null);

    const responseBody = {
      statusCode: httpStatus,
      error: error,
      message: message,
      details: details,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      timestamp: new Date().toISOString(),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
