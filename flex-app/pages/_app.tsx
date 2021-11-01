import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import NavigationBar from "../components/NavigationBar";
import { createMemoryHistory } from "history";
import { AuthProvider, GetAuthContext } from "../contexts/authContext";

//#region Pages
import booking from "./booking";
import community_home from "./community_home";
import community_talk from "./community_talk";
import index from "./index";
import paidPlan from "./paidPlan";
import timeLine from "./timeLine";
import uploadPhoto from "./uploadPhoto";
//#endregion

const myHistory = createMemoryHistory();

const PrivateRoute = ({ component, exact, path }: { component: any, exact?: boolean, path: string }) => {
  const { user } = GetAuthContext();
  return user ? (
    <Route exact={exact} path={path} component={component} />
  ) : (
    <Redirect to="/" />
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Router history={myHistory}>
        <NavigationBar />

        <Switch>
          <Route path="/" exact component={index} />

          <Route path="/booking" component={booking} />
          <Route path="/community_home" component={community_home} />
          <Route path="/community_talk" component={community_talk} />
          <Route path="/paidPlan" component={paidPlan} />
          <Route path="/timeLine" component={timeLine} />
          <Route path="/uploadPhoto" component={uploadPhoto} />
        </Switch>
      </Router>
    </AuthProvider>
  )
}
export default MyApp
