import React, { useContext, useState } from "react";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";
import loader from "../loader.svg";
import Image from "next/image";
import { Header } from "../components/Header";
interface LoginOptions {
  token: string;
  userId: string;
  username: string;
}
function Login() {
  const history = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  // @ts-ignore
  const {
    login,
  }: { login: (jwtToken: string, id: string, username: string) => void } =
    useContext(AuthContext);
  const [errMessage, setErrMessage] = useState("");
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const loginHandler = async () => {
    setIsFetching(true);
    try {
      await axios
        .post<LoginOptions>(
          "https://qnafab.herokuapp.com/api/auth/login",
          { ...form },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          const { token, userId, username } = response.data;
          login(token, userId, username);
          localStorage.setItem("username", username);
          setIsFetching(false);
          history.push("/");
        })
        .catch((err) => {
          setErrMessage(err.response.data.message);
          setIsFetching(false);
        });
    } catch (e) {
      console.log(e);
    }
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
        <title>Страница авторизации</title>
      </Head>
      <Header />
      <h3>Авторизация</h3>
      {isFetching ? (
        <div className="container center-align">
          <Image src={loader} alt="loading..." className="loader" />
        </div>
      ) : (
        <div className="container login-form">
          <>
            <h4>Логин</h4>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  onChange={changeHandler}
                />
                <div id="emailHelp" className="form-text">
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  We'll never share your email with anyone else.
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  onChange={changeHandler}
                />
              </div>
              {errMessage ? (
                <div className="alert alert-danger" role="alert">
                  {errMessage}
                </div>
              ) : null}
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => loginHandler()}
              >
                Submit
              </button>
              <Link href="/registration">
                <a className="btn btn-outline-dark btn-not-acc">
                  Нет аккаунта ?
                </a>
              </Link>
            </form>
          </>
        </div>
      )}
    </>
  );
}

export default Login;
