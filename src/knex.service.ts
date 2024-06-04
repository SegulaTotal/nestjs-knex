import { Injectable, Inject, Logger } from '@nestjs/common';
import { KNEX_OPTIONS } from './constants';
import { KnexOptions } from './interfaces';
import * as pg from 'pg';

// tslint:disable-next-line: no-var-requires
const Knex = require('knex');

interface IKnexService {
  getKnex();
}

@Injectable()
export class KnexService implements IKnexService {
  private readonly logger: Logger;
  // tslint:disable-next-line:variable-name
  private _knexConnection: any;
  private readonly displayableOptions: object;
  // tslint:disable-next-line:variable-name
  constructor(@Inject(KNEX_OPTIONS) private _knexOptions: KnexOptions) {
    this.logger = new Logger('KnexService');
    // @ts-ignore
    this.logger.log(`Options: ${JSON.stringify({ ...this._knexOptions, connection: { ...this._knexOptions.connection, password: '*****' }})}`);
  }

  getKnex() {
    if (!this._knexConnection) {
      this._knexConnection = new Knex(this._knexOptions);

      // Fix for numeric values returning as text
      pg.types.setTypeParser(pg.types.builtins.INT8, (value: string) => {
        return parseInt(value, 10);
      });
      pg.types.setTypeParser(pg.types.builtins.FLOAT8, (value: string) => {
        return parseFloat(value);
      });
      pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => {
        return parseFloat(value);
      });
    }
    return this._knexConnection;
  }
}
