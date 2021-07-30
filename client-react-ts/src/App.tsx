import React, {useState} from "react";
import "./App.css";
import { Header } from "./components/Header";
import { Questions } from "./components/Questions";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { SingleQuestion } from "./components/SingleQuestion";
import AuthPage from "./components/AuthPage";
// @ts-ignore
import { useAuth } from "auth-hook-yera";
import { AuthContext } from "./context/AuthContext";
import { AskQuestion } from "./components/AskQuestion";
import { Profile } from "./components/Profile";
import { UsersList } from "./components/UsersList";

interface AuthUserModel {
  login: (jwtToken: string, id: string) => void;
  logout: () => void;
  token: string;
  userId: string;
  isReady: boolean;
}

export interface UsersOptions {
  _id: string;
  username: string;
}
function App() {
  const { login, logout, token, userId, isReady }: AuthUserModel = useAuth();
  const isLogin = !!token;
  const [users, setUsers] = useState<Array<UsersOptions>>([]);
  return (
    <AuthContext.Provider
      value={{ login, logout, token, userId, isReady, isLogin }}
    >
      <Router>
        <Switch>
          <div className="App">
            <Header setUsers={setUsers} />
            <Route exact path="/" render={() => <Questions />} />
            <Route exact path="/login" render={() => <AuthPage />} />
            <Route exact path="/ask" render={() => <AskQuestion />} />
            <Route exact path="/q/:id" render={() => <SingleQuestion />} />
            <Route exact path="/profile/:username" render={() => <Profile />} />
            <Route exact path="/search/:username" render={() => <UsersList users={users} />} />
          </div>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
