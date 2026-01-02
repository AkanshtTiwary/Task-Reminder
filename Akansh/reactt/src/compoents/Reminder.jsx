import React, { useRef, useState } from "react";

const Reminder=()=>{
    let inputData=useRef();
    let [data,setData]=useState([]);
    function handleClick(){
        setData([inputData.current.Value,...data])
        inputData.current.Value=" ";
    }
    return(
        <>
        <div>
            <input type="text" ref={inputData}></input>
            <button onClick={handleClick}>Click to Add</button>

        </div>
        <div>
            {data.map((e)=>(
                <div>{e}</div>
            ))}
        </div>
        </>
    )
}
export default Reminder