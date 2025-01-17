import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import typeORMconfig from '~/config/typeorm';
import { BikeshopModule } from '~bikeshop/bikeshop.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(typeORMconfig)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow('typeorm'),
    }),
    BikeshopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
