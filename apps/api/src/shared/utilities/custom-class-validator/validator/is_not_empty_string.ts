import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

function IsNonEmptyString(minLength = 1, validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: 'isNonEmptyString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [{ minLength }],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return (
                        typeof value === 'string' &&
                        value.trim() !== '' &&
                        value.trim().length >= args.constraints[0].minLength
                    );
                },
                defaultMessage: (args: ValidationArguments) => {
                    if (typeof args.value !== 'string' || args.value.trim() === '') {
                        return `${args.property} must be a non empty string`;
                    }

                    return `${args.property} must be a string  with a minimum length of  ${args.constraints[0].minLength} characters.`;
                },
            },
        });
    };
}

export default IsNonEmptyString;
