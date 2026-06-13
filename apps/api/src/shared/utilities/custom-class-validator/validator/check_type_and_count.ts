import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function CheckTypeAndCount(property?: string, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'CheckTypeAndCount',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const obj: any = args.object as any;
                    if (value == Object.keys(obj)[1] && Object.keys(obj).length == 2) {
                        return true;
                    }
                    return false;
                },
                defaultMessage(value: any) {
                    return `please provide the ${value.object['type']} key or either you pass more than 2 properties`;
                },
            },
        });
    };
}
