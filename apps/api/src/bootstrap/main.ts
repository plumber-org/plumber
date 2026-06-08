import { NestFactory } from '@nestjs/core';
import { AppModule } from '@api/bootstrap/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionWrapper } from '@api/shared/exceptions/error.http.wrapper';
import { ValidationError } from 'class-validator';
import { IFieldError } from '@api/shared/exceptions/error.interface';
import { DEFAULT_ERROR } from '@api/shared/constants/error/errors/default';
async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule);

        // Getting configuration for app server
        const configService = app.get(ConfigService);
        const env = configService.get('app.env');
        const host = configService.get('app.http.host');
        const port = configService.get('app.http.port');
        const versioning = configService.get('app.versioning.on');
        const globalPrefix = configService.get('app.globalPrefix');

        // Setting environment in NODE_ENV
        process.env.NODE_ENV = env;

        // Setting validation pipe for DTO
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                exceptionFactory: (validationErrors: ValidationError[]) => {
                    const getError = (
                        error: ValidationError[],
                        appendFieldName = '',
                    ): IFieldError[] => {
                        return error.reduce((value, error) => {
                            if (error.children?.length) {
                                const newError = getError(
                                    error.children,
                                    `${appendFieldName}${error.property}.`,
                                );
                                value = [...value, ...newError];
                            } else {
                                value = [
                                    ...value,
                                    {
                                        field: appendFieldName + error.property,
                                        error: Object.values(error.constraints).join(', '),
                                    },
                                ];
                            }
                            return value;
                        }, [] as IFieldError[]);
                    };

                    return new HttpExceptionWrapper(
                        DEFAULT_ERROR.DATA_VALIDATION_ERROR,
                        getError(validationErrors),
                    );
                },
            }),
        );

        // Setting logger for logging info and error
        const logger = new Logger();

        // Setting global prefix for api end point
        app.setGlobalPrefix(globalPrefix);

        // Setting versioning for API
        if (versioning) {
            app.enableVersioning({
                type: VersioningType.URI,
                defaultVersion: ['1'],
                prefix: configService.get('app.versioning.prefix'),
            });
        }

        // Starting server at given port and host id
        await app.listen(port, host);

        logger.log(`App Environment is ${env}`, 'App');
        logger.log(`App Versioning is ${versioning}`, 'App');
        logger.log(`Server running on ${await app.getUrl()}`, 'App');
    } catch (error) {
        console.log({ error });
    }
}
bootstrap();
