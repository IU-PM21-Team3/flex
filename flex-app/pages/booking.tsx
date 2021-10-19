import type { NextPage } from "next"
import { useState } from "react"
import Calender from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import CheckBox from "../components/SimpleCheckBox";
import styles from '../styles/BookingPage.module.css';

import { formatDate } from '../utils/utils'


const facilityData = {
  name: "何処火野観光施設"
}

const timesData = {
  radio: [
    { rangeStr: "9-12", checked: false },
    { rangeStr: "12-15", checked: false },
    { rangeStr: "15-18", checked: false },
    { rangeStr: "18-21", checked: false }
  ]
}

const BookingPage: NextPage = () => {
  /**
   * selectDay: 日付の単体選択 
   * 後の要件で日付は複数および範囲で選べた方がいいという意見なら変更する
   * なお、開始日と終了日を指定するという方法もある。
   */
  const [selectDay, setSelectDay] = useState<string>('');
  const [selectTime, setSelectTime] = useState<string>('');
  const [times, setTimes] = useState(timesData);
  const onClickDay = (date: string) => setSelectDay(date);
  const onClickRadio = (e: any) => {
    const clickData = e.target.value;
    const preRadio = times.radio;
    preRadio.map(v => {
      if(v.rangeStr === clickData) v.checked = !v.checked
      if(v.rangeStr !== clickData && v.checked === true) v.checked = false;
    })
    setSelectTime(clickData)
  }


  return (
    <div className={styles.booking}>
      <h1>施設予約</h1>
      <h2>{facilityData.name}</h2>
      <div className={styles.calendar_container}>
        <p>日時を選択してください</p>
        <Calender
          // onClickDay={(date) => onClickDays(formatDate(date, 'yyyy-MM-dd'))}
          onClickDay={(date) => onClickDay(formatDate(date, 'yyyy-MM-dd'))}
        />
        {
          times.radio.map((v, i) => (
            <label key={i}>
              <input
                type="radio"
                checked={v.checked}
                value={v.rangeStr}
                onChange={onClickRadio}
              />
              {v.rangeStr}
            </label>
          ))
        }
      </div>
      <table className={styles.book_table}>
        <tr>
          <th>場所</th>
          <td>{facilityData.name}</td>
        </tr>
        <tr>
          <th>日付</th>
          <td>{selectDay}</td>
        </tr>
        <tr>
          <th>時間</th>
          <td>{selectTime}</td>
        </tr>
      </table>

      <button className={styles.book_button}>施設予約する</button>
    </div>
  );
}

export default BookingPage