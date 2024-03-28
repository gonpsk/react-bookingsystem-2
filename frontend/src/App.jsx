import { useState } from 'react'
import Button from '@mui/material/Button';
import  '../src/Calendar.css'

import axios from 'axios';
import Register from './Components/register';


function App() {
  const [count, setCount] = useState(0)


  
  

  return (
    <>
      
      <Register />
    </>
  )
}

export default App
