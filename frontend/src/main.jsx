import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Login from './Components/login.jsx'
import Booking from './Components/Booking.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";




const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  // {
  //   path: "/register",
  //   element: <Register/>,
  // },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/booking",
    element: <Booking/>,
  },
  
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    <RouterProvider router={router} />
  </React.StrictMode>,
)
