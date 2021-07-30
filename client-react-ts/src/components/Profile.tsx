import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import loader from "../loader.svg";
interface UserResponse {
  questions: {
    _id: string;
    question: string;
    views: number;
  }[];
  user: { _id: string; username: string }[];
}

export const Profile = () => {
  const [question, setQuestion] = useState<UserResponse>({
    questions: [],
    user: [],
  });
  const username = useLocation().pathname.split("/")[2];
  const [err, setErr] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const getUserQuestions = () => {
    axios
      .get<UserResponse>(`/api/question/profile/${username}`)
      .then(({ data }) => {
        setQuestion(data);
        setIsFetching(false);
      })
      .catch((error) => {
        setErr(error.response.data.message);
        setIsFetching(false);
      });
  };

  useEffect(() => {
    getUserQuestions();
  }, []);

  return isFetching ? (
    <div className="container center-align">
      <img src={loader} alt="loading..." className="loader" />
    </div>
  ) : (
    <div className="sing">
      <div className="container question">
        {!err ? (
          <div className="question-wrapper">
            <div className="username-wrapper">
              <p className="username">@{username}</p>
            </div>
            <div className="question-length username-wrapper">
              <h5>{question.questions.length} вопросов</h5>
            </div>
            {question.questions.length ? (
              <div className="collection">
                {question.questions.map((item) => {
                  const { views, question, _id } = item;
                  return (
                    <Link
                      key={_id}
                      to={`/q/${_id}`}
                      className="collection-item"
                    >
                      <span className="badge" key={_id}>
                        {views}
                      </span>
                      {question}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <h4>Вопросов нет</h4>
            )}
          </div>
        ) : (
          <h1>{err}</h1>
        )}
      </div>
    </div>
  );
};
