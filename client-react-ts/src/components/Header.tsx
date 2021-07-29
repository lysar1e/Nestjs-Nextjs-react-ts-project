import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const Header = () => {
  // @ts-ignore
  const { isLogin }: { isLogin: boolean } = useContext(AuthContext);

  return (
    <>
      <nav className="nav">
        <div className="nav-wrapper">
          <Link to="/" className="brand-logo">
            Fabr
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>
              <Link to="/profile">К профилю</Link>
            </li>
            {!isLogin ? (
              <li>
                <Link to="/login">Войти на сайт</Link>
              </li>
            ) : (
              <li>
                <Link to="/ask">Задать вопрос</Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};
