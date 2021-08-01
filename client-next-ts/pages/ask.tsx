import React, { useEffect, useState } from "react";
import axios from "axios";
import loader from "../loader.svg";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { Header } from "../components/Header";

export default function Ask() {
  const [question, setQuestion] = useState("");
  const [owner, setOwner] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [tags, setTags] = useState<string>("");
  const history = useRouter();
  const [description, setDescription] = useState("");

  useEffect(() => {
    // @ts-ignore
    return setOwner(localStorage.getItem("username"));
  }, []);
  const postQuestion = () => {
    setIsFetching(true);
    const questionObj = {
      question,
      tags,
      description,
      owner,
    };
    axios
      .post("https://qnafabr.herokuapp.com/api/question/add", {
        ...questionObj,
      })
      .then(() => {
        setIsFetching(false);
        history.push("/");
      });
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
        />
        <title>Задать вопрос</title>
      </Head>
      <Header />
      <div className="container">
        {isFetching ? (
          <div className="container center-align">
            <Image src={loader} alt="loading..." className="loader" />
          </div>
        ) : (
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
        )}
      </div>
    </>
  );
}
