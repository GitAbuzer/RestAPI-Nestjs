import { Logger } from '@nestjs/common';
import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import { isEmail, isPhoneNumber } from 'class-validator';

export function IsEmailOrPhone(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isEmailOrPhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const type = (args.object as any).type;
          Logger.log(type);
          if (type === 'email') {
            return isEmail(value);
          } else if (type === 'phone') {
            return isPhoneNumber(value);
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          const { property, value } = args;
          const typeName = (args.object as any).type;
          switch (typeName) {
            case 'email':
              return `${property} in ${args.object.constructor.name} with value '${value}' must be a valid email address`;
            case 'phone':
              return `${property} in ${args.object.constructor.name} with value '${value}' must be a valid phone number`;
            default:
              return `${property} in ${args.object.constructor.name} with value '${value}' is invalid`;
          }
        },
      },
    });
  };
}
