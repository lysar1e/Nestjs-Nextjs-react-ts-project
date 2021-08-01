import { useRouter } from "next/router";
import Link from "next/link";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Header } from "../../components/Header";
interface UserResponse {
  questions: {
    _id: string;
    question: string;
    views: number;
  }[];
  user: { _id: string; username: string }[];
}

export default function Profile({ user }: { user: UserResponse }) {
  const username = useRouter().query.username;
  let err = "";
  if (!user) {
    err = "Пользователь не найден!";
  }
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
        <title>Профиль</title>
      </Head>
      <Header setUsers={() => {}} />
      <div className="sing">
        <div className="container question">
          {!err ? (
            <div className="question-wrapper">
              <div className="username-wrapper">
                <p className="username">@{username}</p>
              </div>
              <div className="question-length username-wrapper">
                <h5>{user.questions.length} вопросов</h5>
              </div>
              {user.questions.length ? (
                <div className="collection">
                  {user.questions.map((item) => {
                    const { views, question, _id } = item;
                    return (
                      <Link href={`/q/${_id}`} key={_id}>
                        <a className="collection-item">
                          <span className="badge" key={_id}>
                            {views}
                          </span>
                          {question}
                        </a>
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
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const username = query.username;
  const res = await fetch(
    `https://qnafabr.herokuapp.com/api/question/profile/${username}`
  );
  const json = await res.json();
  if (res.status !== 404) {
    return {
      props: { user: json },
    };
  }
  return {
    props: { user: null },
  };
};
