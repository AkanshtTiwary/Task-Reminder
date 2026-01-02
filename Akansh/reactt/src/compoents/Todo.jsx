import React, { useState } from 'react'

const Todo = () => {
    let [input,setInput]=useState('');
    let [todo,setTodo]=useState([]);
    const handleDelete = () => {
        setTodo([]);
    }
    
    const handleInput = () => {
        setTodo([input]);
    }
    
    return (
    <div>
        <div className='p-5 text-center space-x-7'>
            <input onChange={(e)=>{setInput(e.target.value)}} className="border p-3 text-4xl"/>
            <button onClick={handleInput} className='text-white p-3 text-3xl border rounded bg-blue-900'>Add Todo</button>
        </div>
        {todo.length > 0 &&(
        <div className='p-4 text-4xl bg-amber-700 text-white flex justify-evenly'>{input}
            <button className='border p-3 bg-red-800' onClick={handleDelete}>Delete Todo</button>
        </div>
        )}
    </div>
  )
}

export default Todo