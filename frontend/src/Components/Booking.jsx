import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '@mui/material/Button';
import ReactCalendar from 'react-calendar'
import RegisterValidation from './Registervalidation';
import { useLocation } from 'react-router-dom';



function Booking() {

  // รับค่า email ที่ล็อคอินมาจากหน้า login
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user = searchParams.get('email');
  //

  const [userData, setUserData] = useState(null); // สร้าง state เพื่อเก็บข้อมูลผู้ใช้
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    checkindate: '',
    checkoutdate: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: ''

  });

  const [bookedDates, setBookedDates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const currentDate = new Date();
  const daynowinput = new Date().toISOString().split('T')[0];

  // รับข้อมูล user ที่มีอีเมล์ตรงกับที่login มา
  const fetchUserData = async (email) => {
    try {
      const response = await axios.get(`http://localhost:3002/user?email=${email}`);
      setUserData(response.data); // เก็บข้อมูลผู้ใช้ใน state

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  fetchUserData(user);
  //  end 


  //  ยืนยันตัวตนว่ามี token ไหม ตรงกันไหม
  useEffect(() => {

    const token = localStorage.getItem('token')

    axios.post('http://localhost:3002/authen',
      null,
      {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }
    )
      .then((res) => {
        if (res.data.status === 'ok') {

        } else {
          alert('Authen failed')
          localStorage.removeItem('token')
          window.location = '/login'
        }

      })
      .catch((err) => {
        console.log('Error sending data', err)
      })
  }, [])

  //  end


  // ทำให้ปุ่มจางบนปฏิทินเพื่อให้รู้ว่ามีคนจองแล้ว
  // function tileDisabled({ date }) {
  //   // เรียกใช้ axios.get เพื่อดึงข้อมูลจากเซิร์ฟเวอร์เมื่อโหลดครั้งแรกเท่านั้น

  //   // รับค่าวันที่จองแล้ว จากฐานข้อมูล
  //   useEffect(() => {
  //     axios.get('http://localhost:3002/checkin')
  //       .then(response => {
  //         // สร้างอาร์เรย์ของวันที่ที่จองแล้ว
  //         const bookedDates = response.data.map(item => new Date(item.checkindate));
  //         setBookedDates(bookedDates);
  //       })
  //       .catch(error => {
  //         console.error(error);
  //       });
  //   }, []);

  //   // ทำการตรวจสอบว่าวันที่ในปฏิทินอยู่ในรายการวันที่ที่จองหรือไม่
  //   return bookedDates.some(bookedDate => isSameDay(bookedDate, date));
  // };
  function tileDisabled({ date }) {
    const [bookedRanges, setBookedRanges] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3002/checkin')
            .then(response => {
                // สร้างอาร์เรย์ของช่วงวันที่ที่จองแล้ว
                const bookedRanges = response.data.map(item => ({
                    startDate: new Date(item.checkindate),
                    endDate: new Date(item.checkoutdate)
                }));
                setBookedRanges(bookedRanges);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    // ทำการตรวจสอบว่าวันที่ในปฏิทินอยู่ในช่วงวันที่ที่จองหรือไม่
    return bookedRanges.some(range => isWithinRange(date, range.startDate, range.endDate));
}

function isWithinRange(date, startDate, endDate) {
  return date >= startDate && date < endDate;
}




  // ฟังก์ชันเช็คว่าวันที่เหมือนกันหรือไม่
  function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  };

  function Logout(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location = '/login';
  }
  function handleDateSelect(date) {
    setSelectedDate(date);
    setShowForm(true);
    // ปรับเวลาให้เป็นเวลาของผู้ใช้
    const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    setFormData({
      ...formData,
      checkindate: adjustedDate.toISOString().split('T')[0] // Format the date as YYYY-MM-DD
    });
  };

  // รับค่าในฟอร์มที่กรอก
  function handleInputChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  //  เมื่อกด submit 
  function handleSubmit(event) {
    event.preventDefault();
    setErrors(RegisterValidation(formData))

  }

  useEffect(() => {
    // ถ้าไม่มี error ให้จองห้องพักได้
    if (
      errors.checkindate === '' &&
      errors.checkoutdate === '' &&
      errors.firstname === '' &&
      errors.lastname === '' &&
      errors.email === '' &&
      errors.phone === ''
    ) {
      axios
        .post('http://localhost:3002/booking', formData)
        .then((res) => {
          if (res.status === 200 && res.data.status === 'ok') {
            alert('จองห้องพักสำเร็จ');
            window.location = `/booking?email=${user}`;
            console.log(res);
            // window.location = '/login';
          } else {
            alert('เกิดข้อผิดพลาด: ' + res.data.message);
            console.log(res.data.message);
          }
        })
        .catch((err) => {
          console.log('Error sending data', err);
        });
    }
  }, [errors]);


  // ปุ่มปิด
  function closeform() {
    setShowForm(false)
  }





  return (
    <>

      <div className="navbar  bg-pink-100 fixed ">
        <div className="navbar-start ">

          <a className="btn btn-ghost text-xl">PSK</a>
        </div>

        <div className="navbar-end mr-20">
          <button className="btn btn-primary" onClick={Logout}>Logout</button>

        </div>


      </div>

      <div className='min-h-screen bg-center bg-cover bg-no-repeat ' style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }} >
        <div className='pt-28 mx-auto text-center'>

          <h1 className='text-3xl font-bold'>Booking System</h1>
          {userData && userData.map((user, index) => (
            <div key={index}>
              <h2 className='text-3xl mt-8'>Welcome, {user.fname} {user.lname}</h2>

            </div>
          ))}

          <h2 className='text-5xl mt-12 font-semibold text-red-600'>Please select date to booking</h2>

        </div>



        <div className='calendar'>


          <div className='h-full'>

            <div className='w-8/12 mx-auto'>

              <div className='flex justify-center pt-24 '>
                <ReactCalendar
                  onChange={handleDateSelect}
                  tileDisabled={tileDisabled}
                  minDate={currentDate}
                // ใช้ฟังก์ชันเพื่อป้องกันไม่ให้เลือกวันที่ที่มีการจอง


                />
              </div>
            </div>
          </div>
        </div>





        {showForm && (
          <div className="flex w-9/12 bg-white rounded-xl mx-auto shadow-lg overflow-hidden mt-20" style={{ transform: 'translateY(-570px)' }}>
            <div className="flex flex-col justify-center items-center w-1/2 bg-center bg-cover bg-no-repeat p-8" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")' }}>
              <ReactCalendar
                tileDisabled={tileDisabled}


              />
            </div>
            <div className="w-1/2 py-12 px-16 ">
              <div className='flex justify-between'>
                <h2 className="text-3xl mb-4">Booking</h2>
                <button className="btn btn-error ml-40" onClick={closeform} >X</button>
              </div>


              <form onSubmit={handleSubmit}>

                <div className="mt-4">
                  <label htmlFor="checkindate" className='text-lg text-red-500'>Check-in-date</label>
                  <input type="date" min={daynowinput} name="checkindate" className="border border-gray-500 py-1 px-2 w-full" placeholder="Check-in Date" onChange={handleInputChange}
                    value={formData.checkindate}
                  />
                  {errors.checkindate && <span className="text-red-500">{errors.checkindate}</span>}
                </div>

                <div className="mb-4">
                  <label htmlFor="checkoutdate" className='text-lg text-red-500'>Check-out-date</label>
                  <input type="date" min={daynowinput} name="checkoutdate" className="border border-gray-500 py-1 px-2 w-full" placeholder="Check-out Date" onChange={handleInputChange} />
                  {errors.checkoutdate && <span className="text-red-500">{errors.checkoutdate}</span>}
                </div>

                <div className="mb-4">
                  <input type="text" name="firstname" className="border border-gray-500 py-1 px-2 w-full" placeholder="Firstname" onChange={handleInputChange} />
                  {errors.firstname && <span className="text-red-500">{errors.firstname}</span>}
                </div>

                <div className="mb-4">
                  <input type="text" name="lastname" className="border border-gray-500 py-1 px-2 w-full" placeholder="Lastname" onChange={handleInputChange} />
                  {errors.lastname && <span className="text-red-500">{errors.lastname}</span>}
                </div>

                <div className="mb-4">
                  <input type="email" name="email" className="border border-gray-500 py-1 px-2 w-full" placeholder="Email" onChange={handleInputChange} />
                  {errors.email && <span className="text-red-500">{errors.email}</span>}
                </div>

                <div className="mb-4">
                  <input type="tel" name="phone" className="border border-gray-500 py-1 px-2 w-full" placeholder="Phone Number" onChange={handleInputChange} />
                  {errors.phone && <span className="text-red-500">{errors.phone}</span>}
                </div>

                <div className="mt-4">
                  <button type="submit" className="w-full bg-purple-400 py-3 text-center text-white text-xl">Submit</button>
                </div>
              </form>
            </div>

            <div className='calendar'>


              <div className='h-full'>

                <div className='w-8/12 '>

                  <div className='flex justify-center pt-24'>

                  </div>
                </div>
              </div>
            </div>

          </div>
        )}



      </div>

    </>
  )
}

export default Booking
