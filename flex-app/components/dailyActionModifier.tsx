import React, { useEffect, useState } from "react";
import { DBActionDataCtrler } from "../firebase/DBActionDataCtrler";
import { Grid, Button, MenuItem, TextField, CircularProgress } from "@material-ui/core";
import { TextField as LabTextField } from "@mui/material";
import AdapterMoment from "@mui/lab/AdapterMoment";
import { LocalizationProvider, TimePicker } from "@mui/lab";

import { useForm, Controller } from "react-hook-form";
import { DBActionData } from "../firebase/DBTypes";
import { cloneDeep } from "lodash";

// ref : https://dev.classmethod.jp/articles/react-beginners-tried-to-create-a-modern-web-form-with-material-ui-and-react-hook-form/

const DailyActionModifier = (props: { ctrler: DBActionDataCtrler; closeDialogAction?: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [arriveDate, setArriveDate] = useState(new Date());
  const [leaveDate, setLeaveDate] = useState(new Date());
  const [isBusy, setIsBusy] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: cloneDeep(props.ctrler.DBActionData),
  });

  const onSubmit = (data: DBActionData) => {
    setIsBusy(true);

    // 日付の形式がMoment独自のものになっているため, 一度Dateに変換してから使用する
    data.arriveDate = new Date(arriveDate);
    data.leaveDate = new Date(leaveDate);

    props.ctrler.addOrUpdateDailyPlanAction(data).then(() => {
      if (props.closeDialogAction != null) {
        props.closeDialogAction(false);
      }
    }).finally(() => setIsBusy(false));
  };

  const onDelete = () => {
    setIsBusy(true);

    props.ctrler.deleteDailyPlanAction().then(() => {
      if (props.closeDialogAction != null) {
        props.closeDialogAction(false);
      }
    }).finally(() => setIsBusy(false));
  };

  useEffect(() => {
    setArriveDate(props.ctrler.DBActionData.arriveDate);
    setLeaveDate(props.ctrler.DBActionData.leaveDate);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment as any}>
      <Grid container style={{ maxHeight: "70vh", padding: "0em 4em" }}>
        <Grid>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="actionType"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="行動の種類"
                  fullWidth
                  margin="normal"
                  id="select"
                  select
                >
                  <MenuItem value="unknown">不明</MenuItem>
                  <MenuItem value="visit">訪問/観光</MenuItem>
                  <MenuItem value="move">移動</MenuItem>
                </TextField>
              )}
            />

            <Controller
              control={control}
              name="placeName"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="場所の名前"
                  fullWidth
                  margin="normal"
                  placeholder="例): 東京駅, 五稜郭, etc."
                />
              )}
            />

            <Controller
              control={control}
              name="placeID"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Google MapのPlaceID"
                  fullWidth
                  margin="normal"
                />
              )}
            />

            <div style={{ marginTop: "1em" }}>
              <TimePicker
                value={arriveDate}
                onChange={(v) => setArriveDate(v ?? props.ctrler.DBActionData.arriveDate)}
                renderInput={(params) => <LabTextField {...params} />}
              />
            </div>

            <div style={{ marginTop: "1em" }}>
              <TimePicker
                value={leaveDate}
                onChange={(v) => setLeaveDate(v ?? props.ctrler.DBActionData.leaveDate)}
                renderInput={(params) => <LabTextField {...params} />}
              />
            </div>

            <Controller
              control={control}
              name="businessState"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="営業状態"
                  fullWidth
                  margin="normal"
                  id="select"
                  select
                >
                  <MenuItem value="unknown">不明</MenuItem>
                  <MenuItem value="normal">通常営業</MenuItem>
                  <MenuItem value="temporaryClosing">臨時休業中</MenuItem>
                  <MenuItem value="shortTimeBiz">時短営業中</MenuItem>
                </TextField>
              )}
            />

            <Controller
              control={control}
              name="memo"
              render={({ field }) => (
                <TextField
                  {...field}
                  multiline
                  rows={3}
                  label="メモ"
                  fullWidth
                  size="medium"
                  margin="normal"
                />
              )}
            />

            {
              isBusy ?
                (<CircularProgress style={{ marginTop: 5 }} />) :
                (
                  <div style={{ margin: "1em 0.5em" }}>
                    <Button
                      style={{ margin: "inherit" }}
                      variant="outlined"
                      color="secondary"
                      type="submit"
                      onClick={() => onDelete()}>
                      削除
                    </Button>
                    <Button
                      style={{ margin: "inherit" }}
                      variant="contained"
                      color="primary"
                      type="submit">
                      保存
                    </Button>
                  </div>
                )
            }

            <Button
              style={{ position: "absolute", bottom: "1em", right: "1em" }}
              variant="contained"
              onClick={() => props.closeDialogAction?.call(props, false)}>
              閉じる
            </Button>
          </form>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default DailyActionModifier;
