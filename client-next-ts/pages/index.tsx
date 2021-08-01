import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { Header } from "../components/Header";
export interface QuestionsResponse {
  views: number;
  _id: string;
  question: string;
}
export interface UsersOptions {
  _id: string;
  username: string;
}
export default function Home({
  questions,
}: {
  questions: Array<QuestionsResponse>;
}) {
  const [users, setUsers] = useState<Array<UsersOptions>>([]);
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
        <title>Все вопросы</title>
      </Head>
      <Header setUsers={setUsers} />
      <div className="container">
        <>
          <div className="collection">
            {questions.map((item) => {
              const { _id, views, question } = item;
              return (
                <>
                  <Link href={`/q/${_id}`} key={_id}>
                    <a className="collection-item">
                      <span className="badge">{views} просмотров</span>
                      <span>{question}</span>
                    </a>
                  </Link>
                </>
              );
            })}
          </div>
        </>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`https://qnafab.herokuapp.com/api/question`);
  const json = await res.json();
  return {
    props: { questions: json.questions },
  };
};
