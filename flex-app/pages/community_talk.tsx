import type { NextPage } from "next";
import { TextInput } from "../components/Talk_TextInput";
import DefaultLayout from "../components/DefaultLayout";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
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
    <DefaultLayout>
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <p>浅草寺のコミュニティ</p>
          <Paper id="style-1" className={classes.messagesBody}></Paper>
          <TextInput />
        </Paper>
      </div>
    </DefaultLayout>
  );
};

export default Community_Talk;