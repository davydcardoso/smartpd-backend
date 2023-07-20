import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserRepository } from '../users/infra/repositories/user.repository';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';
import { JwtPayload, verify } from 'jsonwebtoken';

interface HeadersProps extends Headers {
  userId: string;
  companyId: string;
}

interface JwtPayloadExtends extends JwtPayload {
  userId: string;
  companyId: string;
}

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly companiesRepository: CompanyRepository,
  ) {}

  async use(req: Request, res: Response, next: (error?: any) => void) {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedException(
        'Token do usuário não informado ou incorreto',
      );
    }

    const [, token] = authorization.split(' ');

    if (!token) {
      throw new UnauthorizedException(
        'Token de usuário invalido ou não informado',
      );
    }

    const result = await new Promise<string | JwtPayload>((resolve, reject) => {
      verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          resolve('ERROR');
          return;
        }

        resolve(decoded);
      });
    });

    if (result === 'ERROR') {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar está funcionalidade',
      );
    }

    const { userId, companyId } = result as JwtPayloadExtends;

    if (!userId && !companyId) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar está funcionalidade, token de acesso invalido, empresa e usuário não definidos',
      );
    }

    const user = await this.usersRepository.getById(userId);

    if (!user) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar está funcionalidade, usuário não existe no sistema',
      );
    }

    const company = await this.companiesRepository.getById(companyId);

    if (!company) {
      throw new Error(
        'Você não tem permissão para acessar está funcionalidade, empresa não registrada no sistema ',
      );
    }

    if (company.status.value !== 'ACTIVATED') {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar está funcionalidade, o cadatro da entidade está desativado',
      );
    }

    if (
      user.accessLevel.value !== 'ADMINISTRATOR' &&
      user.accessLevel.value !== 'DEVELOPER'
    ) {
      throw new UnauthorizedException(
        'Você não possui nivel de acesso para acessar está funcionalidadee',
      );
    }

    req.headers = { ...req.headers, userId, companyId };

    next();
  }
}
