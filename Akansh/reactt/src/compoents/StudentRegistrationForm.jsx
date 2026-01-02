import React, { useRef, useState } from 'react';

const StudentRegistrationForm=()=>{
    let[data,setData]=useState([]);
    let inputName=useRef();
    let inputRegno=useRef();
    let inputCgpa=useRef();

    function handleClick(e){
        e.preventDefault();
    let newData={
        name:inputName.current.value,
        reg:inputRegno.current.value,
        cgpa:inputCgpa.current.value,
    }
    setData([newData, ...data])
    inputName.current.value=" ";
    inputRegno.current.value=" ";
    inputCgpa.current.value=" ";
}
    return(
        <>
        <div>
            <form>
            <input type="text" placeholder='name' ref={inputName}></input>
            <input type="number" placeholder='regno' ref={inputRegno}></input>
            <input type="number" placeholder='CGPA'ref={inputCgpa}></input>
            <button onClick={handleClick}>Click here</button>
            </form>
        </div>
        <div>
            {data.map((e, index)=>(
                <div key={index}>name:{e.name},reg:{e.reg},cgpa:{e.cgpa}</div>
            ))}
        </div>
        </>
    )
}

export default StudentRegistrationForm;