import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Story } from './schemas/story.schema';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';

@Injectable()
export class StoryService {
  constructor(@InjectModel(Story.name) private model: Model<Story>) {}

  async create(dto: CreateStoryDto, userId: string) {
    const story = new this.model({
      ...dto,
      author: userId,
    });
    return story.save();
  }

  async findAll() {
    return this.model.find().populate('categories').populate('author', 'name email');
  }

  async findOne(id: string) {
    const story = await this.model.findById(id).populate('categories').populate('author', 'name email');
    if (!story) throw new NotFoundException('Story not found');
    return story;
  }

  async update(id: string, dto: UpdateStoryDto) {
    const story = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!story) throw new NotFoundException('Story not found');
    return story;
  }

  async remove(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
