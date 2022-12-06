import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest() as Request;

    if (!request.headers.signature || !request.headers.identifier) return false;

    const client = await this.cacheManager.get(
      request.headers.identifier as string,
    );
    if (!client) return false;

    request.headers['client'] = JSON.parse(client as string);

    return true;
  }
}
