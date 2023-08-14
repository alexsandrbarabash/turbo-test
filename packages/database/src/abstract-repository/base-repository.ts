import {
  DataSource,
  DeepPartial,
  QueryRunner,
  ObjectLiteral,
  EntityTarget,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  UpdateResult,
} from 'typeorm';

import { NotFoundException } from '@cowchain/exceptions';
import { DatabaseException } from '../exceptions';

export interface IAbstractRepository<Entity extends ObjectLiteral> {
  getByParams({
    where,
    limit,
    skip,
    throwError,
    relations,
    qr,
    order,
  }: {
    where?: FindOptionsWhere<Entity>;
    limit?: number;
    skip?: number;
    throwError?: boolean;
    relations?: string[];
    qr?: QueryRunner;
    order?: FindOptionsOrder<Entity>;
  }): Promise<Entity[]>;

  getOneByParams<T extends boolean>({
    where,
    throwError,
    relations,
  }: {
    where: FindOptionsWhere<Entity>;
    throwError?: T;
    relations?: string[];
  }): Promise<T extends false ? null | Entity : Entity>;

  save(data: DeepPartial<Entity>, qr?: QueryRunner): Promise<Entity>;

  saveMany(data: DeepPartial<Entity>[], qr?: QueryRunner): Promise<Entity[]>;

  count(where: FindManyOptions<Entity>, qr?: QueryRunner): Promise<number>;

  update(
    where: FindOptionsWhere<Entity>,
    partialEntity: Partial<Entity>,
    qr?: QueryRunner,
  ): Promise<UpdateResult>;
}

export function BaseRepository<Entity extends ObjectLiteral>(
  ref: EntityTarget<Entity>,
): {
  new (dataSource: DataSource): IAbstractRepository<Entity>;
} {
  abstract class AbstractRepository implements IAbstractRepository<Entity> {
    constructor(protected readonly dataSource: DataSource) {}

    async getByParams(
      {
        where,
        limit,
        skip,
        throwError = true,
        relations = [],
        qr,
        order,
      }: {
        where?: FindOptionsWhere<Entity>;
        limit?: number;
        skip?: number;
        throwError?: boolean;
        relations?: string[];
        qr?: QueryRunner;
        order?: FindOptionsOrder<Entity>;
      } = { throwError: true },
    ): Promise<Entity[]> {
      try {
        const repo = this.getRepository(qr);
        const data = await repo.find({
          where: where,
          take: limit,
          skip,
          relations,
          order,
        });

        if (throwError && (!data || !data?.length)) {
          throw new NotFoundException('Data not found!', where);
        }

        return data;
      } catch (error) {
        throw new DatabaseException(error.message, error);
      }
    }

    async getOneByParams({
      where,
      throwError = true,
      relations = [],
    }: {
      where: FindOptionsWhere<Entity>;
      throwError?: boolean;
      relations?: string[];
    }): Promise<Entity> {
      const data = await this.getByParams({
        where,
        limit: 1,
        throwError,
        relations,
      });
      return data[0];
    }

    async save(data: DeepPartial<Entity>, qr?: QueryRunner): Promise<Entity> {
      try {
        const repo = this.getRepository(qr);

        return await repo.save(data, { transaction: false });
      } catch (error) {
        throw new DatabaseException(error.message, error);
      }
    }

    async saveMany(
      data: DeepPartial<Entity>[],
      qr?: QueryRunner,
    ): Promise<Entity[]> {
      try {
        const repo = this.getRepository(qr);
        return await repo.save(data);
      } catch (error) {
        throw new DatabaseException(error.message, error);
      }
    }

    count(where: FindManyOptions<Entity>, qr?: QueryRunner) {
      const repo = this.getRepository(qr);
      return repo.count(where);
    }

    update(
      where: FindOptionsWhere<Entity>,
      partialEntity: Partial<Entity>,
      qr?: QueryRunner,
    ) {
      const repo = this.getRepository(qr);
      return repo.update(where, partialEntity);
    }

    getRepository(qr?: QueryRunner) {
      if (qr) {
        return qr.manager.getRepository(ref);
      }
      return this.dataSource.getRepository(ref);
    }
  }

  return AbstractRepository as any;
}
