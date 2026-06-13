import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import { AdditionalValidator, Validators } from '../default.validator';

/**
 * Custom validation decorator that requires the decorated property
 * to have a value if a specific property meets certain conditions.
 *
 * @param config An array containing two strings: [checkAgainstProperty, propertyShouldHaveValue]
 * @param validationOptions Options used to pass to validation decorators.
 * @returns
 */
function RequiredIf(
    config: [string, string | number],
    additionalValidator?: AdditionalValidator,
    validationOptions?: ValidationOptions,
) {
    return (object: Record<string, any>, propertyName: string) => {
        registerDecorator({
            name: 'requiredIf',
            target: object.constructor,
            propertyName,
            constraints: [config, additionalValidator ? Validators[additionalValidator] : null],
            options: validationOptions,
            validator: {
                /**
                 * Validates the decorated property based on the dependent property and required value.
                 * @param value The value of the decorated property.
                 * @param args ValidationArguments containing object and constraints.
                 * @returns True if the validation condition is met, false otherwise.
                 */
                validate(value: any, args: ValidationArguments) {
                    const [checkAgainstProperty, propertyShouldHaveValue] = args.constraints[0];

                    const propertyHasValue = (args.object as any)[checkAgainstProperty];

                    const hasValue = !!value; // 0, null, '' are not considered as value

                    const isValid =
                        propertyHasValue !== propertyShouldHaveValue ||
                        (propertyHasValue === propertyShouldHaveValue && hasValue);

                    const validateFn = args.constraints[1];
                    if (isValid && hasValue && validateFn) {
                        return validateFn(value);
                    }

                    return isValid;
                },
                defaultMessage: (_args: ValidationArguments) => {
                    return `${propertyName} is required ${
                        additionalValidator
                            ? `and should be ${additionalValidator.replace('is', '')}`
                            : ''
                    }`;
                },
            },
        });
    };
}

export default RequiredIf;
