import type { NextPage } from "next";
import { TextInput } from "../components/Talk_TextInput";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import PrivatePage from "../components/PrivatePage";
import React from "react";

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      width: "100vw",
      height: "90vh",
      maxWidth: "1000px",
      maxHeight: "700px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative",
    },
    paper2: {
      width: "100vw",
      maxWidth: "500px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative",
    },
    container: {
      width: "90vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    messagesBody: {
      width: "calc( 100% - 20px )",
      margin: 10,
      overflowY: "scroll",
      height: "calc( 100% - 80px )",
    },
  })
);

const Community_Talk: NextPage = () => {
  const classes = useStyles();
  return (
    <PrivatePage>
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <p>浅草寺のコミュニティ</p>
          <Paper id="style-1" className={classes.messagesBody}></Paper>
          <TextInput />
        </Paper>
      </div>
    </PrivatePage>
  );
};

export default Community_Talk;
