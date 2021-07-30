import React from "react";
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
interface AuthUserModel {
  login: (jwtToken: string, id: string) => void;
  logout: () => void;
  token: string;
  userId: string;
  isReady: boolean;
}
function App() {
  const { login, logout, token, userId, isReady }: AuthUserModel = useAuth();
  const isLogin = !!token;
  return (
    <AuthContext.Provider
      value={{ login, logout, token, userId, isReady, isLogin }}
    >
      <Router>
        <Switch>
          <div className="App">
            <Header />
            <Route exact path="/" render={() => <Questions />} />
            <Route exact path="/login" render={() => <AuthPage />} />
            <Route exact path="/ask" render={() => <AskQuestion />} />
            <Route exact path="/q/:id" render={() => <SingleQuestion />} />
            <Route exact path="/profile/:username" render={() => <Profile />} />
          </div>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
