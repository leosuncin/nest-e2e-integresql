import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isNumberString,
  registerDecorator,
} from 'class-validator';
import type { EntityManager, EntityTarget } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
@ValidatorConstraint({ name: 'isForeignKey', async: true })
export class IsForeignKeyConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  validate(
    value: string,
    { constraints }: ValidationArguments,
  ): boolean | Promise<boolean> {
    if (!isNumberString(value)) return true;

    this.#assertHasEntity(constraints);
    const Entity = constraints[0];

    return this.entityManager.existsBy(Entity, { id: value });
  }

  defaultMessage({ constraints }: ValidationArguments): string {
    this.#assertHasEntity(constraints);
    const [Entity] = constraints;

    // @ts-expect-error get entity class name
    return `The $value is not a valid ${Entity.name}.`;
  }

  #assertHasEntity(
    constraints: unknown[],
  ): asserts constraints is [EntityTarget<any>] {
    if (!constraints || constraints.length !== 1) {
      throw new Error('Entity target is required');
    }
  }
}

export function IsForeignKey(
  entity: EntityTarget<any>,
  options: ValidationOptions = {},
) {
  return (object: object, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options,
      constraints: [entity],
      validator: IsForeignKeyConstraint,
    });
}
