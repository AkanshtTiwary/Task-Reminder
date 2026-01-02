// import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// // import './App.css'
// // import Navbar from '../component/Navbar'
// function App() {
//   // const [count, setCount] = useState(0)
// //function can return only single value
//   return (
//     <> {/**fragments */}
//     {/* <Navbar/> */}
//     </>  //fragments
//   )
// }

import react from "react";
import { useState } from "react";
function App() {
  return (
    <>
      <div id="web page">
        <nav className="flex justify-evenly items-center">
          <div>
            <img
              src="https://www.dominos.co.in/assets/Logo.png"alt=""
            />
          </div>

          <div>
            <button className="text-blue-500 px-4">Our menu</button>
            <button className="text-blue-500 px-4">Domino's store</button>
            <button className="text-blue-500 px-4">Gift cards</button>
            <button className="text-blue-500 px-4">Corporate Enquiry</button>
            <button className="text-blue-500 px-4">Contact us</button>
          </div>
          <div>
            <button className ="bg-red-500 text-white px-4 py-2 rounded">
              Download App
            </button>
          </div>
        </nav>

        <div className="online-order bg-blue-600 mt-4" >
         <div className="bannertext">
            <h2>Domino's online ordering</h2>
            <p>Yummy pizza delivered fast & fresh</p>
         </div>
         <img className="w-full md:w-3/4 mt-6" src="https://www.dominos.co.in/assets/header_bg.png" alt="" />
        </div>
      </div>

      <div></div>
    </>
  );
}
export default App;
