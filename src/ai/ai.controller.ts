import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { AiService } from './ai.service';
import { StoryService } from '../story/story.service';

@Controller('stories')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly storyService: StoryService,
  ) {}

  @Get(':id/suggest')
  async suggest(@Param('id') id: string) {
    const story = await this.storyService.findOne(id);
    if (!story) throw new NotFoundException('Story not found');

    const suggestion = await this.aiService.suggestNext(story.title, story.content);
    return { suggestion };
  }
}
