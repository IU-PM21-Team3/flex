import { NextPage } from 'next'
import PageList from './PageList';
import { useState, Fragment } from "react";
import { signOut } from "firebase/auth";
import flexFirebase from '../firebase/clientApp';
import { GetAuthContext } from "../contexts/authContext";
import SignInUp, { SignInUpTextValues, SignInText, SignUpText } from "./SignInUp";
import React from "react";
import {
  AppBar,
  Toolbar,
  makeStyles,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

// ref : https://qiita.com/harker/items/1504264134dd2278cf2e

const SignOutText = "ログアウト";

const styles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(4),
  },
  title: {
    flexGrow: 1,
  },
  Button: {
    padding: 2,
  },
  SignInUpOutArea: {
    marginLeft: "auto",
  },
}));

const NavigationBar: NextPage = (props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [signInUpText, setSignInUpText] = useState<SignInUpTextValues>(SignInText);
  const classes = styles();

  function openDialogToSignIn() {
    setIsDialogOpen(false);
    setSignInUpText(SignInText);
    setIsDialogOpen(true);
  }
  function openDialogToSignUp() {
    setIsDialogOpen(false);
    setSignInUpText(SignUpText);
    setIsDialogOpen(true);
  }

  function renderSignInUpOrSignOut() {
    if (GetAuthContext().user == null) {
      return (
        <Fragment>
          <div><Button color="inherit" onClick={openDialogToSignIn}>{SignInText}</Button></div>
          <div><Button color="inherit" onClick={openDialogToSignUp}>{SignUpText}</Button></div>

          <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth maxWidth={"sm"}>
            <DialogTitle className={classes.title}>{signInUpText}</DialogTitle>

            <DialogContent>
              <SignInUp signInUpText={signInUpText} />
            </DialogContent>
          </Dialog>
        </Fragment>
      );
    } else {
      return <Button color="inherit" onClick={() => signOut(flexFirebase.auth)}>{SignOutText}</Button>;
    }
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          flex
        </Typography>

        <div className={classes.SignInUpOutArea}>
          {renderSignInUpOrSignOut()}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;