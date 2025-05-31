import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  async findByRefreshToken(refreshToken: string): Promise<User | null> {
    return this.userModel.findOne({ refreshTokens: refreshToken }).exec();
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async addRefreshToken(userId: any, refreshToken: string) {
    return this.userModel.findByIdAndUpdate(userId, {
      $push: { refreshTokens: refreshToken },
    });
  }

  async removeRefreshToken(userId: any, refreshToken: string) {
    return this.userModel.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: refreshToken },
    });
  }

  // Lấy tất cả user, có thể thêm paging, filter sau
  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password -refreshTokens').exec();
    // ẩn password, refreshTokens khi trả về client
  }

  // Tìm user theo id
  async findOne(userId: string): Promise<User> {
    const user = await this.userModel
      .findById(userId)
      .select('-password -refreshTokens') // ẩn các trường nhạy cảm
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
