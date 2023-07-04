import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import GroupsList from "./components/GroupsList";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.thunkRestoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
        <Route exact path="/">
          <LandingPage></LandingPage>
        </Route>
        <Route exact path="/groups">
          <GroupsList></GroupsList>
        </Route>
        <Route path='/groups/:id'>
          <h1> hi :3</h1>
        </Route>
      </Switch>}
    </>
  );
}

export default App;
