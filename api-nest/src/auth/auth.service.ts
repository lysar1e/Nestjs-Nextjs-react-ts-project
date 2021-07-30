import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { compare, hash } from "bcryptjs";
import { LoginUserDto } from "./dto/login-user.dto";
import { sign } from "jsonwebtoken";

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  //Register user
  async createUser(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;
    const isEmailUsed = await this.userModel.findOne({
      email,
    });
    const isUsernameUsed = await this.userModel.findOne({
      username,
    });
    if (isEmailUsed) {
      throw new HttpException("Email занят!", 409);
      return;
    }
    if (isUsernameUsed) {
      throw new HttpException("Username занят!", 409);
      return;
    }
    const hashedPassword = await hash(password, 12);
    const user = await new this.userModel({
      email,
      username,
      password: hashedPassword,
    });
    await user.save();
    return;
  }

  //Login user
  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException("Пользователь не найден!", 400);
      return;
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new HttpException("Неверный пароль!", 400);
      return;
    }
    const jwtSecret: string = "fhiahifhio";
    const token = await sign({ userId: user.id }, jwtSecret, {
      expiresIn: "1h",
    });
    return { token, userId: user.id, username: user.username };
  }

  //Find Users
  async findUsers(username: string) {
    const s = username;
    const regex = await new RegExp(s, "i");
    const users = await this.userModel.find(
      { username: { $regex: regex } },
      { password: 0, __v: 0, questions: 0, email: 0 }
    );
    return users;
  }
}