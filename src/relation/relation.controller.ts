import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RelationService } from './relation.service';
import { CreateRelationDto } from './dto/create-relation.dto';
import { UpdateRelationDto } from './dto/update-relation.dto';
import { Demo } from './entities/Demo';
import { Demo1 } from './entities/demo1.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { MessageProducerService } from './message.producer.service';

@Controller('relation')
export class RelationController {
  constructor(
    private readonly relationService: RelationService,
    @InjectRepository(Demo)
    private demoRepo: Repository<Demo>,
    @InjectRepository(Demo1)
    private demo1Repo: Repository<Demo1>,
    private readonly msp: MessageProducerService,
  ) {}

  @Get('heavy-test')
  async heavyTest() {
    this.msp.sendMessage('hi...');
    return 'hi.';
  }

  @Get('test')
  test() {
    return 'test';
  }

  @Get('api/test')
  async apiTest() {
    const profile = await this.relationService.getTBID('sfdc-devil050998');
    const tbId = JSON.parse(JSON.stringify(profile)).profileUser.Id;
    return Promise.all([
      this.relationService.getRank(tbId),
      this.relationService.getBadges(tbId, 50),
      this.relationService.getCertificate(tbId, 'sgupta487'),
      this.relationService.getSuperbadge(tbId, 30),
    ])
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      });
  }

  @Post('insert')
  async create(@Body() createRelationDto: CreateRelationDto) {
    // const demo11 = new Demo1();
    // demo11.id = 11;
    // demo11.username = 'demo1-u11';
    // demo11.createAt = new Date();
    // await this.demo1Repo.save(demo11);

    // const demo12 = new Demo1();
    // demo12.id = 12;
    // demo12.username = 'demo1-u12';
    // demo12.createAt = new Date();
    // await this.demo1Repo.save(demo12);

    const newDemo = await this.demo1Repo.findOne({
      where: {
        username: 'demo1-u11',
      },
    });

    const demo = new Demo();
    demo.id = 2;
    demo.username = 'demo-u2';
    demo.createAt = new Date();
    demo.demos1 = [newDemo];
    await this.demoRepo.save(demo);
    // console.log(JSON.stringify(newDemo));
    return { demo };
  }

  @Get('find-all')
  async findAll() {
    const all = await this.demo1Repo.find({
      relations: {
        demos: true,
      },
    });
    console.log(all);
    console.log(JSON.parse(JSON.stringify(all)));
    return all;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRelationDto: UpdateRelationDto,
  ) {
    return this.relationService.update(+id, updateRelationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.relationService.remove(+id);
  }
}
