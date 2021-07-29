import { Module } from "@nestjs/common";
import { QuestionService } from "./question.service";
import { QuestionController } from "./question.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Question, QuestionSchema } from "./schemas/question.schema";
import { User, UserSchema } from "../auth/schemas/user.schema";

@Module({
  providers: [QuestionService],
  controllers: [QuestionController],
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class QuestionModule {}
