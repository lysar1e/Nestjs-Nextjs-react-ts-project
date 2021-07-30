import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export const Header = () => {
  // @ts-ignore
  const { isLogin }: { isLogin: boolean } = useContext(AuthContext);
  const username = localStorage.getItem('username');
  const [user, setUser] = useState('');
  const findUsers = () => {
      axios.post('/api/auth/find', {username: user}).then(res => console.log(res))
  }
  const findUser = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      findUsers();
  }
  return (
    <>
      <nav className="nav">
        <div className="nav-wrapper">
          <Link to="/" className="brand-logo">
            Fabr
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {!isLogin ? (
              <li>
                <Link to="/login">Войти на сайт</Link>
              </li>
            ) : (
                <>
                <li>
                  <Link to={`/profile/${username}`}>К профилю</Link>
                </li>
              <li>
                <Link to="/ask">Задать вопрос</Link>
              </li>
                </>
            )}
            <li>
              <form onSubmit={findUser}>
                <input type="text" placeholder="Найти пользователя" onChange={e => setUser(e.target.value)} />
              </form>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};
