import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import loader from "../loader.svg";
interface AnswerOptions {
  answer: string;
  username: string;
  likes: [];
  id: string;
}

interface QuestionsResponse {
  views: number;
  owner: string;
  question: string;
  description: string;
  tags: string;
  answers: [];
}

export const SingleQuestion = () => {
  const location = useLocation();
  const [isFetching, setIsFetching] = useState(true);
  const path = location.pathname.split("/")[2];
  const [answer, setAnswer] = useState("");
  // @ts-ignore
  const { isLogin }: { isLogin: boolean } = useContext(AuthContext);
  const [question, setQuestion] = useState({
    views: 0,
    owner: "",
    question: "",
    description: "",
    tags: "",
    answers: [],
  });
  const getQuestion = () => {
    setIsFetching(true);
    axios.get<QuestionsResponse>(`https://qnafabr.herokuapp.com/api/question/${path}`).then((res) => {
      const { views, owner, question, description, tags, answers } = res.data;
      setQuestion({
        views,
        owner,
        question,
        description,
        tags,
        answers,
      });
      setIsFetching(false);
    });
  };
  const postAnswer = async () => {
    await axios.post(`https://qnafabr.herokuapp.com/api/question/answer/${path}`, {
      answer,
      username: localStorage.getItem("username"),
    });
    getQuestion();
  };

  const likeAnswer = async (id: string) => {
    await axios.post(`https://qnafabr.herokuapp.com/api/question/like-answer/${path}`, {
      answerId: id,
      username: localStorage.getItem("username"),
    });
    getQuestion();
  };

  useEffect(() => {
    getQuestion();
  }, []);

  return (
    <>
      {isFetching ? (
        <div className="container center-align">
          <img src={loader} alt="loading..." className="loader" />
        </div>
      ) : (
        <div className="sing">
          <div className="container question">
            <div className="question-wrapper">
              <div className="username-wrapper">
                <p className="username">@{question.owner}</p>
              </div>
              <div className="tags">
                <p className="tag">{question.tags}</p>
              </div>
              <div className="question-wrapper">
                <h4 className="question">{question.question}</h4>
                <div className="question-desc">
                  <p className="question-description">{question.description}</p>
                </div>
              </div>
              <div className="views">
                <p className="view-count">{question.views} просмотров</p>
              </div>
              <div className="your-answer-wrapper">
                <p className="your-answer">Ваш ответ на вопрос</p>
              </div>
              {question.answers.length
                ? question.answers.map((item: AnswerOptions) => {
                    const { username, answer, id } = item;
                    return (
                      <div className="answers">
                        <div className="answer-username-wrapper">
                          <p className="answer-username">@{username}</p>
                        </div>
                        <div className="answer-wrapper">
                          <p className="answer">{answer}</p>
                        </div>
                        <button
                          className="btn"
                          onClick={() => likeAnswer(id)}
                          disabled={!isLogin}
                        >
                          Нравится | {item.likes.length}
                        </button>
                      </div>
                    );
                  })
                : null}
              {isLogin ? (
                <div className="answer-group">
                  <textarea
                    className="text-area-input"
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                  <br />
                  <button className="btn" onClick={() => postAnswer()}>
                    Опубликовать
                  </button>
                </div>
              ) : (
                <Link to="/login">Войти чтобы ответить на вопрос</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
