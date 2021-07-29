import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { QuestionsResponse } from "./Questions";

export const Profile = () => {
  const username = localStorage.getItem("username");
  const [question, setQuestion] = useState<Array<QuestionsResponse>>([]);
  const getUserQuestions = () => {
    axios
      .get<QuestionsResponse[]>(`/api/question/profile/${username}`)
      .then(({ data }) => {
        setQuestion(data);
      });
  };
  useEffect(() => {
    getUserQuestions();
  }, []);
  return (
    <div className="sing">
      <div className="container question">
        <div className="question-wrapper">
          <div className="username-wrapper">
            <p className="username">@{username}</p>
          </div>
          <div className="question-length username-wrapper">
            <h5>{question.length} вопросов</h5>
          </div>
          {question.length ? (
            <div className="collection">
              {question.map((question) => {
                return (
                  <Link
                    key={question._id}
                    to={`/q/${question._id}`}
                    className="collection-item"
                  >
                    <span className="badge" key={question._id}>
                      {question.views} просмотров
                    </span>
                    {question.question}
                  </Link>
                );
              })}
            </div>
          ) : (
            <h4>Вопросов нет</h4>
          )}
          {/*    <div className="question-wrapper">*/}
          {/*        <h4 className="question">{question.question}</h4>*/}
          {/*        <div className="question-desc">*/}
          {/*            <p className="question-description">{question.description}</p>*/}
          {/*        </div>*/}
          {/*    </div>*/}
          {/*    <div className="views">*/}
          {/*        <p className="view-count">{question.views} просмотров</p>*/}
          {/*    </div>*/}
          {/*    <div className="your-answer-wrapper">*/}
          {/*        <p className="your-answer">Ваш ответ на вопрос</p>*/}
          {/*    </div>*/}
          {/*    {question.answers.length*/}
          {/*        ? question.answers.map((item: AnswerOptions) => {*/}
          {/*            return (*/}
          {/*                <div className="answers">*/}
          {/*                    <div className="answer-username-wrapper">*/}
          {/*                        <p className="answer-username">@{item.username}</p>*/}
          {/*                    </div>*/}
          {/*                    <div className="answer-wrapper">*/}
          {/*                        <p className="answer">{item.answer}</p>*/}
          {/*                    </div>*/}
          {/*                    <button*/}
          {/*                        className="btn"*/}
          {/*                        onClick={() => likeAnswer(item.id)}*/}
          {/*                        disabled={!isLogin}*/}
          {/*                    >*/}
          {/*                        Нравится | {item.likes.length}*/}
          {/*                    </button>*/}
          {/*                </div>*/}
          {/*            );*/}
          {/*        })*/}
          {/*        : null}*/}
          {/*    {isLogin ? (*/}
          {/*        <div className="answer-group">*/}
          {/*<textarea*/}
          {/*    className="text-area-input"*/}
          {/*    onChange={(e) => setAnswer(e.target.value)}*/}
          {/*/>*/}
          {/*            <br />*/}
          {/*            <button className="btn" onClick={() => postAnswer()}>*/}
          {/*                Опубликовать*/}
          {/*            </button>*/}
          {/*        </div>*/}
          {/*    ) : (*/}
          {/*        <Link to="/login">Войти чтобы ответить на вопрос</Link>*/}
          {/*    )}*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
};
