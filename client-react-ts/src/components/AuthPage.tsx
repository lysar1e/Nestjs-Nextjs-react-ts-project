import React, { useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import loader from "../loader.svg";

interface LoginOptions {
  token: string;
  userId: string;
  username: string;
}

function AuthPage() {
  const [isFetching, setIsFetching] = useState(false);
  const history = useHistory();
  const [errMessage, setErrMessage] = useState("");
  const [regErrMessage, setRegErrMessage] = useState("");
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });
  // @ts-ignore
  const {
    login,
  }: { login: (jwtToken: string, id: string, username: string) => void } =
    useContext(AuthContext);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      setIsFetching(true);
      await axios
        .post(
          "https://qnafabr.herokuapp.com/api/auth/register",
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

  const loginHandler = async () => {
    try {
      setIsFetching(true);
      await axios
        .post<LoginOptions>(
          "https://qnafabr.herokuapp.com/api/auth/login",
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
    <Router>
      <Switch>
        <React.Fragment>
          <Route path="/login">
            <h3>Авторизация</h3>
            <div className="container login-form">
              {isFetching ? (
                <div className="container center-align">
                  <img src={loader} alt="loading..." className="loader" />
                </div>
              ) : (
                <>
                  <h4>Логин</h4>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
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
                        We'll never share your email with anyone else.
                      </div>
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
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
                    <Link
                      to="/registration"
                      className="btn btn-outline-dark btn-not-acc"
                    >
                      Нет аккаунта ?
                    </Link>
                  </form>
                </>
              )}
            </div>
          </Route>

          <Route path="/registration">
            <h3>Авторизация</h3>
            <div className="container login-form">
              {isFetching ? (
                <div className="container center-align">
                  <img src={loader} alt="loading..." className="loader" />
                </div>
              ) : (
                <>
                  <h4>Регистрация</h4>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
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
                        We'll never share your email with anyone else.
                      </div>
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
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
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
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
                    <Link
                      to="/login"
                      className="btn btn-outline-dark btn-not-acc"
                    >
                      Уже есть аккаунт ?
                    </Link>
                  </form>
                </>
              )}
            </div>
          </Route>
        </React.Fragment>
      </Switch>
    </Router>
  );
}
export default AuthPage;
