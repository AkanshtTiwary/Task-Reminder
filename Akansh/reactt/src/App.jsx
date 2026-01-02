
import React, { useState } from 'react'
import Todo from './compoents/Todo'

const App = () => {
 let [data, setData] =useState([])
 function handleAdd(e){
  setData(old=>[e,...old])
 }
 function handleDelete(e){
  setData((data)=>data.filter((value,index) => e!==index))
 }
  return (
    
    <>
    <div>
      {/* <Form handleAdd={handleAdd} data={data} handleDelete={handleDelete}></Form> */}
    </div>
    <Todo/>
    </>
  )
}

export default App

// import React from 'react'
// import Counter from './compoents/Counter'
// import Todo from './compoents/Todo'
// import StudentRegistrationForm from './compoents/StudentRegistrationForm'
// import Reminder from './compoents/Reminder'

// const App = () => {
//   return (
//     <div>
//       {/* <Counter /> */}
//       {/* <StudentRegistrationForm /> */}
//       <Reminder />
//       {/* <Todo /> */}
//     </div>
//   )
// }

// export default App