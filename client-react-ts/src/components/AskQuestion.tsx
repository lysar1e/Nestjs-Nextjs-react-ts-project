import React, { useState } from "react";
import axios from "axios";

export const AskQuestion = () => {
  const [question, setQuestion] = useState("");
  const [tags, setTags] = useState<string>("");
  const [description, setDescription] = useState("");
  // @ts-ignore

  const owner = localStorage.getItem("username");
  const postQuestion = () => {
    const questionObj = {
      question,
      tags,
      description,
      owner,
    };
    axios.post("/api/question/add", {
      ...questionObj,
    });
  };

  return (
    <div className="container">
      <div className="container login-form">
        <h4>Задать вопрос</h4>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Суть вопроса
            </label>
            <input
              type="text"
              name="question"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Теги вопроса
            </label>
            <input
              type="text"
              name="tags"
              className="form-control"
              id="exampleInputPassword1"
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <textarea
              name="details"
              className="form-control"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => postQuestion()}
          >
            Опубликовать
          </button>
        </form>
      </div>
    </div>
  );
};
