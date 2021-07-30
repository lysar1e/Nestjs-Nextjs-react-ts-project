import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Question, QuestionDocument } from "./schemas/question.schema";
import { AddQuestionDto } from "./dto/add-question.dto";
import { PostAnswerDto } from "./dto/post-answer.dto";
import { LikeAnswerDto } from "./dto/like-answer.dto";
import { User, UserDocument } from "../auth/schemas/user.schema";
const uniqid = require("uniqid");

interface LikeAnswerOptions {
  answer: string;
  username: string;
  likes: Array<string>;
  id: string;
}

interface AnswerOptions extends LikeAnswerOptions {}
@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async createQuestion(addQuestionDto: AddQuestionDto) {
    const { question, tags, description, owner } = addQuestionDto;
    const id: string = await uniqid();
    const questionObject = {
      question,
      tags,
      description,
      owner,
      id,
    };
    const user = await this.userModel.findOne({
      username: addQuestionDto.owner,
    });
    if (!user) {
      throw new HttpException("Что-то пошло не так попробуйте еще раз", 401);
    }
    // @ts-ignore
    await user.questions.push(questionObject);
    await user.save();
    const quest = await new this.questionModel(questionObject);
    await quest.save();
    return quest;
  }

  async getAllQuestions(page) {
    const PAGE_SIZE = 5;
    const pages = parseInt(page);
    const total = await this.questionModel.countDocuments();
    const questions = await this.questionModel
      .find()
      .sort({ createdAt: -1 })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * pages);
    return { questions, totalPages: Math.ceil(total / PAGE_SIZE) };
  }

  async getQuestionById(id: string) {
    const question = await this.questionModel.findById(id);
    if (!question) {
      throw new HttpException("Вопрос не найден!", 404);
      return;
    }
    question.views++;
    question.save();
    return question;
  }

  async answerQuestion(questionId: string, postAnswerDto: PostAnswerDto) {
    const question = await this.questionModel.findById(questionId);
    const id = await uniqid();
    if (!question) {
      throw new HttpException("Вопрос не найден!", 404);
      return;
    }
    const answerObject: AnswerOptions = {
      answer: postAnswerDto.answer,
      username: postAnswerDto.username,
      likes: [],
      id,
    };

    // @ts-ignore
    question.answers.push(answerObject);
    return question.save();
  }

  async likeAnswer(id: string, likeAnswerDto: LikeAnswerDto) {
    const question = await this.questionModel.findById(id);
    if (!question) {
      throw new HttpException("Вопрос не найден!", 404);
      return;
    }
    const answer = question.answers.filter(
      (item: LikeAnswerOptions) => item.id === likeAnswerDto.answerId
    );
    if (!answer) {
      return;
    }
    answer.forEach((item: LikeAnswerOptions) => {
      const isLiked = item.likes.includes(likeAnswerDto.username);
      if (isLiked) {
        const index = item.likes.indexOf(likeAnswerDto.username);
        item.likes.splice(index, 1);
      } else {
        item.likes.push(likeAnswerDto.username);
      }
    });
    question.markModified("answers");
    return question.save();
  }

  async getUserQuestions(username: string) {
    const user = await this.userModel.find({ username }, {password: 0, __v: 0, email: 0, questions: 0});
    const questions = await this.questionModel.find({owner: username}, {__v: 0});
    if (!user.length) {
      throw new HttpException("Пользователь не найден!", 404);
      return;
    }
    return {user, questions};
  }
}
