import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { StoryModule } from '../story/story.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [StoryModule, ConfigModule],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
