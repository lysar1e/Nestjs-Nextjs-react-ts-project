import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";
import { Header } from "../components/Header";
import Image from "next/image";
import loader from "../loader.svg";
function Registration() {
  const history = useRouter();
  const [regErrMessage, setRegErrMessage] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const registerHandler = async () => {
    try {
      setIsFetching(true);
      await axios
        .post(
          "https://qnafab.herokuapp.com/api/auth/register",
          { ...form },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          setIsFetching(false);
          history.push("/login");
        })
        .catch((err) => {
          setRegErrMessage(err.response.data.message);
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
        <title>Страница регистрации</title>
      </Head>
      <Header />
      {isFetching ? (
        <div className="container center-align">
          <Image src={loader} alt="loading..." className="loader" />
        </div>
      ) : (
        <>
          <h4>Регистрация</h4>
          <div className="container login-form">
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
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  onChange={changeHandler}
                />
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
              {regErrMessage ? (
                <div className="alert alert-danger" role="alert">
                  {regErrMessage}
                </div>
              ) : null}
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => registerHandler()}
              >
                Submit
              </button>
              <Link href="/login">
                <a className="btn btn-outline-dark btn-not-acc">
                  Уже есть аккаунт ?
                </a>
              </Link>
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default Registration;
