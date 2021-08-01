import React from "react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Header } from "../../components/Header";

export default function UsersList({
  users,
}: {
  users: { username: string; _id: string }[];
}) {
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
        <title>Найти пользователя</title>
      </Head>
      <Header />
      <div className="container">
        <h3>Найдено пользователей: {users.length}</h3>
        <div className="collection">
          {users.map((user) => {
            const { username, _id } = user;
            return (
              <Link key={_id} href={`/profile/${username}`}>
                <a className="collection-item">{username}</a>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const user = query.user;
  const res = await fetch(
    `https://qnafabr.herokuapp.com/api/auth/find/${user}`,
    { method: "POST" }
  );
  const json = await res.json();
  return {
    props: { users: json },
  };
};
