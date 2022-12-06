import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetOrganization = createParamDecorator(
  (
    _data: any,
    context: ExecutionContext,
  ): {
    signature: string;
    identifier: string;
    client: any;
  } => {
    const { headers } = context.switchToHttp().getRequest();
    return {
      client: headers.client,
      signature: headers.signature as string,
      identifier: headers.identifier as string,
    };
  },
);
