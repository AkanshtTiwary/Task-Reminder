import React, { useState } from 'react'

const Counter = () => {
    let [count, setCount] = useState(0);
    function handleSub(){
        setCount(count--);
    }
    function handleAdd(){
        setCount(count++);
    }
  return (
    <div>
        <button className='flex justify-center m-4 p-4 bg-red-100 text-white  ' onClick={handleSub}>-</button>
        <div className=''>{count}</div>
        <button className='flex justify-center m-4 p-4 bg-green-100 text-white  ' onClick={handleAdd}>+</button>
    </div>
  )
}

export default Counter