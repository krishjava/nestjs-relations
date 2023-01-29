import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Demo } from './relation/entities/Demo';
import { Demo1 } from './relation/entities/demo1.entity';
import { RelationModule } from './relation/relation.module';

@Module({
  imports: [
    RelationModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'relationship',
      entities: [Demo, Demo1],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
