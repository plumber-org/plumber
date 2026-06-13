import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ResponseDefaultInterceptor } from './response.default.interceptor';

/**
 * This decorator is used to format response data. It wraps the response data with
 * additional information specified in the response constants found in the /src/constants/response directory.
 * The returned JSON format is as follows:
 * {
 *      statusCode: 200,
 *      message: "Message defined in response constants",
 *      data: [] || [{}],
 *      metadata: {}
 * }
 *
 * Note: You can override the default statusCode and message by including them in the returned JSON using the same structure.
 *
 * @param messagePath - The key for a specific message in the response constants
 * @returns
 */
export function ResponseCustom(messagePath: string) {
    return applyDecorators(UseInterceptors(ResponseDefaultInterceptor(messagePath)));
}
