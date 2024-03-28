import React from 'react'
import { useState, useEffect } from 'react';
import RegisterValidation from './Registervalidation';
import axios from 'axios';

function register() {


  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  function handleInput(event) {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))


  }



  function handleSubmit(event) {
    event.preventDefault();
    setErrors(RegisterValidation(values));
  }

  useEffect(() => {
    // ถ้าไม่มี error ก็จะส่งข้อมูล
    if (
      errors.firstname === '' &&
      errors.lastname === '' &&
      errors.email === '' &&
      errors.password === '' &&
      errors.confirmPassword === ''
    ) {
      axios
        .post('http://localhost:3002/register', {
          fname: values.firstname,
          lname: values.lastname,
          email: values.email,
          password: values.password
        })
        .then((res) => {
       
          if (res.status === 200 && res.data.status === 'ok') {
            alert('สมัครสมาชิกเสร็จสิ้น');
            console.log(res);
            window.location = '/login';
          } else {
            alert('เกิดข้อผิดพลาด: ' + res.data.message);
            console.log(res.data.message);
          }

        })
        .catch((err) => {
          console.log('Error sending data', err);
        });
    }
  }, [errors]); // Run this effect every time errors change




  return (
    <>
      {/* nav */}
      <div className="navbar bg-pink-100 fixed top-0 left-0 w-full z-50">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">PSK</a>
        </div>
      </div>
      {/* end nav */}



      <div className="min-h-screen py-40" style={{ backgroundImage: 'linear-gradient(115deg, #9F7AEB, #fEE2FD)' }}>
        <div className="container mx-auto">
          <div className="flex w-8/12 bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
            <div className="flex flex-col justify-center items-center w-1/2 bg-center bg-cover bg-no-repeat p-8" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")' }}>
            </div>
            <div className="w-1/2 py-12 px-16">
              <h2 className="text-3xl mb-4">Register</h2>
              {/* form start */}
              <form onSubmit={handleSubmit} >

                <div className="">
                  <input type="text" onChange={handleInput} name="firstname" className="border border-gray-500 py-1 px-2 w-full"
                    placeholder="Firstname"
                  />
                  {errors.firstname && <span className="text-red-500">{errors.firstname}</span>}
                  <input type="text" name="lastname" className="border border-gray-500 py-1 px-2 mt-4 w-full"
                    placeholder="Lastname" onChange={handleInput} />
                  {errors.lastname && <span className="text-red-500">{errors.lastname}</span>}
                </div>
                <div className="mt-4">
                  <input type="email" name="email" className="border border-gray-500 py-1 px-2 w-full"
                    placeholder="Email" onChange={handleInput} />
                  {errors.email && <span className="text-red-500">{errors.email}</span>}
                </div>
                <div className="mt-4">
                  <input type="password" name="password" className="border border-gray-500 py-1 px-2 w-full"
                    placeholder="Password" onChange={handleInput}
                  />
                  {errors.password && <span className="text-red-500">{errors.password}</span>}
                </div>
                <div className="mt-4">
                  <input type="password" name="confirmPassword" className="border border-gray-500 py-1 px-2 w-full"
                    placeholder="Confirm password" onChange={handleInput} />
                  {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword}</span>}
                </div>
                <div className="mt-4">
                  <button type="submit" className="w-full bg-purple-400 py-3 text-center text-white text-xl">Register</button>
                </div>
                <div className="mt-4 text-end text-blue-500">
                  <a href="/login" className="underline">Already have an account? Sign in</a>
                </div>

              </form>
              {/* form end */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default register
