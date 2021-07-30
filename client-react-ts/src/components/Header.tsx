import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { UsersOptions } from "../App";


interface Props {
    setUsers: React.Dispatch<React.SetStateAction<UsersOptions[]>>;

}
export const Header: React.FC<Props> = ({setUsers}) => {
  const history = useHistory();
  // @ts-ignore
  const { isLogin }: { isLogin: boolean } = useContext(AuthContext);
  const username = localStorage.getItem('username');
  const [user, setUser] = useState('');
  const findUsers = async () => {
      axios.post(`/api/auth/find/${user}`).then(res => {
        setUsers(res.data);
        history.push(`/search/${user}`);
      })
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
