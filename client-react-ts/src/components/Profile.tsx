import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { QuestionsResponse } from "./Questions";

export const Profile = () => {
  const [question, setQuestion] = useState<Array<QuestionsResponse>>([]);
  const username = useLocation().pathname.split('/')[2];
  const [err, setErr] = useState('');
  const getUserQuestions = () => {
    axios
      .get<QuestionsResponse[]>(`/api/question/profile/${username}`)
      .then(({ data }) => {
        setQuestion(data);
      })
        .catch(error => setErr(error.response.data.message));
  };
  useEffect(() => {
    getUserQuestions();
  }, []);
  return (
    <div className="sing">
      <div className="container question">
        {
          !err ?
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
              </div>
              : <h1>{err}</h1>
        }
      </div>
    </div>
  );
};
