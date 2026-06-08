import { isNumber, isString, isUUID, isDateString, isEnum, isNotEmpty } from 'class-validator';

export const Validators = {
    isUUID,
    isString,
    isNumber,
    isDateString,
    isEnum,
    isNotEmpty,
} as const;

export type AdditionalValidator = keyof typeof Validators;
