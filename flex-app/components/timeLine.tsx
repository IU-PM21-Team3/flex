import styles from '../styles/timeline.module.css';
import * as moment from 'moment';
import Prev from './Prev';
import React, {useState} from 'react';
import Next from './Next';

const TimeLine = () => {
  const time=['04:00', 
  '05:00', 
  '06:00', 
  '07:00', 
  '08:00', 
  '09:00', 
  '10:00', 
  '11:00',
  '12:00', 
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
  '24:00'];

  /*const initialState: moment.Moment = moment().add(2, 'd').format('MM/DD(ddd)');*/
  var today = new Date();
  var year  = today.getFullYear(); 
  var month = today.getMonth()+1;   
  var date = today.getDate();
  var day = today.getDay();


  const [count, setCount] = useState(date);
  const click = () => {
  setCount(count-1);
  }
 
/*
  moment.locale('ja', {
    weekdays: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
    weekdaysShort: ['日','月','火','水','木','金','土']
  })
*/
  return (
    <body>
      <div className={styles.daytable}>
          <div className={styles.button}>
            <Prev count={count} click={click}/>
            <Next count={count} click={click}/>
          </div>
          <div id={styles.day}>
          <h1>{month}/{count}</h1>
          </div>
        </div>
          <div className={styles.timetable}>
          <div id={styles.time}>
            <ul>
              <li>{time[0]}</li> 
              <li>{time[1]}</li>
              <li>{time[2]}</li>
              <li>{time[3]}</li>
              <li>{time[4]}</li>
              <li>{time[5]}</li>
              <li>{time[6]}</li>
              <li>{time[7]}</li>
              <li>{time[8]}</li>
              <li>{time[9]}</li>
              <li>{time[10]}</li>
              <li>{time[11]}</li>
              <li>{time[12]}</li>
              <li>{time[13]}</li>
              <li>{time[14]}</li>
              <li>{time[15]}</li>
              <li>{time[16]}</li>
              <li>{time[17]}</li>
              <hr/>
              <li>{time[18]}</li>
              <li>{time[19]}</li>
              <li>{time[20]}</li>
            </ul>
              </div>
              <div className={styles.line}>
              <hr/>
              <hr/>
              </div>
         </div>
   </body>
  
  ) 
}    

export default TimeLine;
