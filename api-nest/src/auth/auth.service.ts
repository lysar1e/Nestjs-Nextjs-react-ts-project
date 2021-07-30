import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { compare, hash } from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { sign } from 'jsonwebtoken';

interface UserFindOptions {
  _id: string;
  email: string;
  username: string;
}
@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  //Register user
  async createUser(createUserDto: CreateUserDto) {
    const isEmailUsed = await this.userModel.findOne({
      email: createUserDto.email,
    });
    const isUsernameUsed = await this.userModel.findOne({
      username: createUserDto.username,
    });
    if (isEmailUsed) {
      throw new HttpException('Email занят!', 409);
      return;
    }
    if (isUsernameUsed) {
      throw new HttpException('Username занят!', 409);
      return;
    }
    const hashedPassword = await hash(createUserDto.password, 12);
    const newUser = {
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashedPassword,
    };
    const user = await new this.userModel(newUser);
    return user.save();
  }

  //Login user
  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne({ email: loginUserDto.email });
    if (!user) {
      throw new HttpException('Пользователь не найден!', 400);
      return;
    }
    const isMatch = await compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new HttpException('Неверный пароль!', 400);
      return;
    }
    const jwtSecret: string =
      'fhiahifhio3yi1yior31ihf1y90143941hf1whifhsaf13rf';
    const token = await sign({ userId: user.id }, jwtSecret, {
      expiresIn: '1h',
    });
    return { token, userId: user.id, username: user.username };
  }

  async findUsers(username: string) {
    const s = username;
    const regex = await new RegExp(s, 'i') // i for case insensitive
    const users = await this.userModel.find({username: {$regex: regex}}, {password: 0, __v: 0, questions: 0, email: 0});
    return users;
    // const allUsers: UserFindOptions[] = [];
    // users.map((item) => {
    //   // @ts-ignore
    //   const {passwordd, ...others} = item;
    //   // @ts-ignore
    //   const {password, questions, __v, ...other} = others._doc;
    //  allUsers.push(other);
    // });
    // return allUsers;
  }
}
