import { Types } from 'mongoose';
import { Kind, ValueNode } from 'graphql';

import { CustomScalar, Scalar } from '@nestjs/graphql';

@Scalar('ObjectId', () => Types.ObjectId)
export class ObjectIdScalar implements CustomScalar<string, Types.ObjectId> {
  name = 'ObjectId';
  description = 'Mongo Object ID scalar type';

  parseValue(value: string): Types.ObjectId {
    return new Types.ObjectId(value);
  }

  serialize(value: Types.ObjectId): string {
    return value.toHexString();
  }

  parseLiteral(ast: ValueNode): Types.ObjectId {
    if (ast.kind === Kind.STRING) {
      return new Types.ObjectId(ast.value);
    }

    return null;
  }
}
