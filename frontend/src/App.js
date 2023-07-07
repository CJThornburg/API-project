import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import GroupsList from "./components/GroupsList";
import GroupDets from "./components/GroupDets/index";
import EventsList from "./components/EventsList";
import EventDets from './components/EventDets';
import GroupForm from './components/GroupForm'

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
        <Route exact path="/groups/new">
          <GroupForm version="create"></GroupForm>
        </Route>
        <Route  path="/groups/:id/edit">
          <GroupForm version="edit"></GroupForm>
        </Route>
        <Route exact path="/groups">
          <GroupsList></GroupsList>
          {/* <h1>HEEELLLLLLLLLLLLLLLLLOOOOOOO</h1> */}
        </Route>
        <Route path='/groups/:id'>
          <GroupDets></GroupDets>
        </Route>
        <Route exact path='/events'>
          <EventsList></EventsList>
        </Route>
        <Route exact path='/events/:id'>
          <EventDets></EventDets>
        </Route>
      </Switch>}
    </>
  );
}

export default App;
