import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { AskQuestion } from "./components/AskQuestion";
import AuthPage from "./components/AuthPage";
import { Questions } from "./components/Questions";
export const useRoutes = (isLogin: boolean) => {
  if (isLogin) {
    return (
      <Switch>
        <Route path="/ask" exact>
          <AskQuestion />
        </Route>
      </Switch>
    );
  }
  return (
    <Switch>
      <Route path="/login" exact>
        <AuthPage />
      </Route>
      <Redirect to="/login" />
    </Switch>
  );
};
