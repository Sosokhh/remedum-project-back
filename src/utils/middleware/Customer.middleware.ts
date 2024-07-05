import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesManagerEntity } from "../../entities/sales-manager/sales-manager.entity";

@Injectable()
export class CustomerMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(SalesManagerEntity)
    private customersRepository: Repository<SalesManagerEntity>,
    private jwtService: JwtService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    const unAuthorized = {
      status: 'fail',
      message: 'Unauthorized',
    };

    try {
      const { authorization } = req.headers;

      console.log(authorization);
      if (authorization?.startsWith('Bearer')) {
        const token: string = authorization.split(' ')[1];

        // ვერიფიკაცია
        const decoded = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });

        console.log(decoded);
        console.log(authorization);

        // ტოკენის წამოღება იუზერიდან
        const user = await this.customersRepository.findOneOrFail({
          where: { id: decoded?.id },
          loadEagerRelations: false,
        });
        console.log('user', user);

        req.user = user as SalesManagerEntity;
      } else {
        throw new HttpException(unAuthorized, HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {

      throw new HttpException(unAuthorized, HttpStatus.UNAUTHORIZED);
    }
    next();
  }
}
