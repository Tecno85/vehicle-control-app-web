import { Module } from '@nestjs/common';
import { HASURA_CONFIG, readHasuraConfig } from './hasura.config.js';
import { HasuraService } from './hasura.service.js';

@Module({
  providers: [
    // Se lee al crear la app, después de que main.ts carga el .env.
    { provide: HASURA_CONFIG, useFactory: () => readHasuraConfig(process.env) },
    HasuraService,
  ],
  exports: [HasuraService],
})
export class HasuraModule {}
