import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Header } from "../../components/Header";
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

export default function SingleQuestion({
  question,
}: {
  question: QuestionsResponse;
}) {
  const path = useRouter().query.id;
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  // @ts-ignore
  const { isLogin }: { isLogin: boolean } = useContext(AuthContext);
  const postAnswer = async () => {
    await axios.post(
      `https://qnafabr.herokuapp.com/api/question/answer/${path}`,
      {
        answer,
        username: localStorage.getItem("username"),
      }
    );
    router.replace("/q/" + path);
  };
  const likeAnswer = async (id: string) => {
    await axios.post(
      `https://qnafabr.herokuapp.com/api/question/like-answer/${path}`,
      {
        answerId: id,
        username: localStorage.getItem("username"),
      }
    );
    router.replace("/q/" + path);
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
        <title>Страница Вопроса</title>
      </Head>
      <Header setUsers={() => {}} />
      {question ? (
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
                      <div className="answers" key={id}>
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
                <Link href="/login">Войти чтобы ответить на вопрос</Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <h1>Вопрос не найден!</h1>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const id = query.id;
  const res = await fetch(`https://qnafabr.herokuapp.com/api/question/${id}`);
  const json = await res.json();
  if (res.status !== 500) {
    return {
      props: { question: json },
    };
  }
  return {
    props: { question: null },
  };
};
