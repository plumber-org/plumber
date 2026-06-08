import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

function IsSortValue<TKeys extends string = string>(
    value?: TKeys[],
    validationOptions?: ValidationOptions,
) {
    return (object: Record<string, any>, propertyName: string) => {
        registerDecorator({
            name: 'isSortValue',
            target: object.constructor,
            propertyName: propertyName,
            constraints: value ?? [],
            options: validationOptions,
            validator: {
                validate: (sortValues: SortEntity, args: ValidationArguments) => {
                    // Regular expression pattern to match values in the format "word:ASC" or "word:DESC" case-insensitively
                    let isValid = true;
                    const pattern = /^(\w+:(ASC|DESC))(,\w+:(ASC|DESC))*$/;
                    isValid = pattern.test(sortValues);

                    if (args.constraints?.length && isValid) {
                        sortValues.split(',').forEach((sortValue) => {
                            isValid = isValid && args.constraints.includes(sortValue.split(':')[0]);
                        });
                    }

                    return isValid;
                },
                defaultMessage: (args: ValidationArguments) => {
                    if (args.constraints?.length) {
                        const invalidEntry = (args.value as SortEntity)
                            .split(',')
                            .map((sortValue) => {
                                return sortValue.split(':')[0];
                            })
                            .filter((sortValue) => !args.constraints.includes(sortValue));

                        if (invalidEntry.length) {
                            return `Invalid SortBy: Sort value can not be ${invalidEntry}. Valid entry are ${args.constraints}`;
                        }
                    }

                    return `Invalid SortBy: Sort Order should be ASC | DESC case-sensitive`;
                },
            },
        });
    };
}

export default IsSortValue;

/**
 * SortBy value format type
 * Max of 3 value
 */
type SortEntity<TSort extends string = string> =
    | `${TSort}:${SORT_VALUE}`
    | `${TSort}:${SORT_VALUE},${TSort}:${SORT_VALUE}`
    | `${TSort}:${SORT_VALUE},${TSort}:${SORT_VALUE},${TSort}:${SORT_VALUE}`;

enum SORT_VALUE {
    ASCENDING = 'ASC',
    DESCENDING = 'DESC',
}
