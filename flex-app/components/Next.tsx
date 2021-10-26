import React, {useState} from 'react';
import styles from '../styles/timeline.module.css';

function Next(props: any) {
    return (
<div>
    <button id={styles.next} onClick={props.click}>＞</button>
    
</div>
    );
}
 
export default Next;