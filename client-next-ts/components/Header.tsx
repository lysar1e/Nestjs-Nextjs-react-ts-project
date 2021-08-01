import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import { UsersOptions } from "../pages";

interface Props {
  setUsers?: React.Dispatch<React.SetStateAction<UsersOptions[]>>;
}
export const Header: React.FC<Props> = ({ setUsers }) => {
  const history = useRouter();
  const [username, setUsername] = useState("");
  // @ts-ignore
  const { isLogin, logout }: { isLogin: boolean; logout: () => void } =
    useContext(AuthContext);
  useEffect(() => {
    // @ts-ignore
    return setUsername(window.localStorage.getItem("username"));
  }, []);
  const [user, setUser] = useState("");
  const findUsers = async () => {
    history.push(`/search/${user}`);
  };
  const findUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    findUsers();
  };
  return (
    <>
      <nav className="nav">
        <div className="nav-wrapper">
          <Link href="/">
            <a className="brand-logo">Fabr Q&A</a>
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {!isLogin ? (
              <li>
                <Link href="/login">Войти на сайт</Link>
              </li>
            ) : (
              <>
                <li>
                  <button className="btn" onClick={() => logout()}>
                    Выйти
                  </button>
                </li>
                <li>
                  <Link href={`/profile/${username}`}>К профилю</Link>
                </li>
                <li>
                  <Link href="/ask">Задать вопрос</Link>
                </li>
              </>
            )}
            <li>
              <form onSubmit={findUser}>
                <input
                  type="text"
                  placeholder="Найти пользователя"
                  onChange={(e) => setUser(e.target.value)}
                />
              </form>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};
