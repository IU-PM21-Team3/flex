import React, {useState} from 'react';
import styles from '../styles/timeline.module.css';

function Prev(props: any) {
    return (
<div>
    <button id={styles.previous} onClick={props.click}>＜</button>
    
</div>
    );
}
 
export default Prev;