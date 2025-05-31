import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { randomBytes } from 'crypto';

function generateRefreshToken() {
  return randomBytes(64).toString('hex'); // 128 ký tự hex
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email đã được đăng ký');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({ email: dto.email, password: hash, displayName: dto.displayName });
    return this.generateTokens(user);
  }

  async validateUser(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (user && user.password && await bcrypt.compare(dto.password, user.password)) {
      return user;
    }
    return null;
  }

  async generateTokens(user: any) {
    const payload = { email: user.email, sub: user._id };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = generateRefreshToken();

    // Lưu refresh token vào DB
    await this.userService.addRefreshToken(user._id, refresh_token);

    return {
      access_token,
      refresh_token,
      user: { id: user._id, email: user.email, displayName: user.displayName },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user);
  }

  async logout(refreshToken: string) {
    const user = await this.userService.findByRefreshToken(refreshToken);
    if (user) {
      await this.userService.removeRefreshToken(user._id, refreshToken);
    }
  }

  async validateOAuthLogin(user: any) {
    // user = { googleId, email, displayName }
    let dbUser = await this.userService.findByGoogleId(user.googleId);
    if (!dbUser) {
      dbUser = await this.userService.create({
        googleId: user.googleId,
        email: user.email,
        displayName: user.displayName,
      });
    }
    return this.generateTokens(dbUser);
  }

  async refreshToken(oldRefreshToken: string) {
    const user = await this.userService.findByRefreshToken(oldRefreshToken);
    if (!user) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    // Tạo access token mới
    const payload = { email: user.email, sub: user._id };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });

    // Tạo refresh token mới
    const refresh_token = generateRefreshToken();

    // Thay refresh token cũ bằng mới
    await this.userService.removeRefreshToken(user._id?.toString(), oldRefreshToken);
    await this.userService.addRefreshToken(user._id, refresh_token);

    return { access_token, refresh_token };
  }
  
}
