import React, { useEffect, useState } from "react";
import { DBTravelPlanDataCtrler } from "../firebase/DBTravelPlanDataCtrler";
import { DBTravelPlanSummary } from "../firebase/DBTypes";
import { Grid, Button, TextField, CircularProgress } from "@material-ui/core";
import { TextField as LabTextField } from "@mui/material";
import AdapterMoment from "@mui/lab/AdapterMoment";
import { LocalizationProvider, DatePicker } from "@mui/lab";

import { useForm, Controller } from "react-hook-form";
import { cloneDeep } from "lodash";


// ref : https://dev.classmethod.jp/articles/react-beginners-tried-to-create-a-modern-web-form-with-material-ui-and-react-hook-form/

const TravelPlanSummaryModifier = (props: { ctrler: DBTravelPlanDataCtrler; closeDialogAction?: React.Dispatch<React.SetStateAction<boolean>>; }) => {
  const [beginDate, setBeginDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isBusy, setIsBusy] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: cloneDeep(props.ctrler.DBTravelPlanSummary),
  });

  const onSubmit = (data: DBTravelPlanSummary) => {
    setIsBusy(true);

    // 日付の形式がMoment独自のものになっているため, 一度Dateに変換してから使用する
    data.beginDate = new Date(beginDate);
    data.endDate = new Date(endDate);

    props.ctrler.updateTravelPlanSummary(data)
      .then(() => {
        if (props.closeDialogAction != null) {
          props.closeDialogAction(false);
        }
      })
      .finally(() => setIsBusy(false));
  };

  useEffect(() => {
    setBeginDate(props.ctrler.DBTravelPlanSummary.beginDate);
    setEndDate(props.ctrler.DBTravelPlanSummary.endDate);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment as any}>
      <Grid container style={{ maxHeight: "70vh", padding: "0em 4em" }}>
        <Grid>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="planName"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="プラン名"
                  fullWidth
                  margin="normal"
                  placeholder="例): 東京駅, 五稜郭, etc."
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextField
                  {...field}
                  multiline
                  rows={3}
                  label="旅行プランの説明"
                  fullWidth
                  size="medium"
                  margin="normal"
                />
              )}
            />

            <div style={{ marginTop: "1em" }}>
              <DatePicker
                label="開始日"
                inputFormat="yyyy/MM/DD"
                value={beginDate}
                onChange={(v) => setBeginDate(v ?? props.ctrler.DBTravelPlanSummary.beginDate)}
                renderInput={(params) => <LabTextField {...params} />}
              />
            </div>

            <div style={{ marginTop: "1em" }}>
              <DatePicker
                label="終了日"
                inputFormat="yyyy/MM/DD"
                value={endDate}
                onChange={(v) => setEndDate(v ?? props.ctrler.DBTravelPlanSummary.endDate)}
                renderInput={(params) => <LabTextField {...params} />}
              />
            </div>

            {
              isBusy ?
                (<CircularProgress style={{ marginTop: 5 }} />) :
                (
                  <div style={{ margin: "1em 0.5em" }}>
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

export default TravelPlanSummaryModifier;
