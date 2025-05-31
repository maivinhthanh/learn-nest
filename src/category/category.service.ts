import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

  create(dto: CreateCategoryDto) {
    return this.categoryModel.create(dto);
  }

  findAll() {
    return this.categoryModel.find();
  }

  findOne(id: string) {
    return this.categoryModel.findById(id);
  }

  update(id: string, dto: UpdateCategoryDto) {
    return this.categoryModel.findByIdAndUpdate(id, dto, { new: true });
  }

  remove(id: string) {
    return this.categoryModel.findByIdAndDelete(id);
  }
}
