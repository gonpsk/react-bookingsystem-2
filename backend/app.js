const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const secret = 'login 2021'

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'bookingsystem'

})



app.get('/test', (req, res) => {
    res.json({ msg: 'this is something' })
})



app.post('/register', (req, res) => {
    const email = req.body.email;

    // เช็คว่ามีเมล์ในระบบไหม
    const checkemail = "SELECT * FROM users WHERE email = ?";
    db.query(checkemail, [email], (err, emailuser) => {
        if (err) {
            res.json({ status: 'error', message: err });
        }
        if (emailuser.length > 0) {
            res.json({ status: 'error', message: 'Email already exists' });

        } else {
            // ถ้าไม่มีเมลล์ในระบบ, เข้ารหัสพาสเวิร์ดแล้วเพิ่มข้อมูลลงฐานข้อมูล
            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                if (err) {
                    res.json({ status: 'error', message: err });
                } else {
                    const sql = "INSERT INTO users (fname, lname, email, password) VALUES (?, ?, ?, ?)";
                    const values = [
                        req.body.fname,
                        req.body.lname,
                        email,
                        hash
                    ];
                    db.query(sql, values, (err, data) => {
                        if (err) {
                            res.json({ status: 'error', message: err });
                        } else {
                            res.json({ status: 'ok', message: 'User registered successfully' });
                        }
                    });
                }
            });
        }

    });
});









app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    const values = [req.body.email];

    db.query(sql, values, (err, users) => {
        if (err) {
            res.json({ status: 'error', message: err })
            return;
        } else {
            if (users.length == 0) {
                res.json({ status: 'error', message: 'no user found' });
            } else {
                // เทียบรหัสว่าเหมือนกันกับในระบบไหม user[0] หมายถึงผลลัพธ์ที่ได้จากการ query ผู้ใช้ที่สอดคล้องกับเงื่อนไขที่ถูกต้อง
                bcrypt.compare(req.body.password, users[0].password, (err, isLogin) => {
                    if (isLogin) {
                        // ถ้า เมล์ตรงกับระบบ รหัสตรงกัน ให้ token
                        let token = jwt.sign({ email: users[0].email }, secret, { expiresIn: '1h' })
                        res.json({ status: 'ok', message: 'login success', token });
                    } else {
                        res.json({ status: 'error', message: 'login failed' });
                    }
                });
            }
        }
    });
});

app.post('/authen', (req, res) => {

    try {
        const token = req.headers.authorization.split(' ')[1]
        let decoded = jwt.verify(token, secret);
        res.json({ status: 'ok', decoded })
    } catch (err) {
        res.json({ status: 'error', message: err.message })

    }


})




// app.post('/booking', (req, res) => {
//     const checkExistingData = "SELECT * FROM booking WHERE checkindate = ?";
//     db.query(checkExistingData, [req.body.checkindate], (err, data) => {
//         if (err) {
//             res.json({ status: 'error', message: err });
//         } else {
//             if (data.length > 0) {
//                 res.json({ status: 'error', message: 'Check-in date already exists' });
//             } else {
//                 const checkExistingEmail = "SELECT * FROM booking WHERE email = ?";
//                 db.query(checkExistingEmail, [req.body.email], (err, emailData) => {
//                     if (err) {
//                         res.json({ status: 'error', message: err });
//                     } else {
//                         if (emailData.length > 0) {
//                             res.json({ status: 'error', message: 'Email already exists' });
//                         } else {
//                             // ไม่พบข้อมูลที่ซ้ำกันทั้ง check-in date และ email ดำเนินการเพิ่มข้อมูลเข้าฐานข้อมูลตามปกติ
//                             const sql = "INSERT INTO booking (checkindate, checkoutdate, firstname, lastname, email, phone) VALUES (?, ?, ?, ?, ?, ?)";
//                             const values = [
//                                 req.body.checkindate,
//                                 req.body.checkoutdate,
//                                 req.body.firstname,
//                                 req.body.lastname,
//                                 req.body.email,
//                                 req.body.phone
//                             ];
//                             db.query(sql, values, (err, data) => {
//                                 if (err) {
//                                     res.json({ status: 'error', message: err });
//                                 } else {
//                                     res.json({ status: 'ok', message: 'User registered successfully' });
//                                 }
//                             });
//                         }
//                     }
//                 });
//             }
//         }
//     });




// })


app.post('/booking', (req, res) => {
    const checkExistingData = "SELECT * FROM booking WHERE checkindate <= ? AND checkoutdate > ?";
    const values = [req.body.checkoutdate, req.body.checkindate]; // สลับตำแหน่ง check-in และ check-out เพื่อให้เงื่อนไขเป็นปกติ
    db.query(checkExistingData, values, (err, data) => {
        if (err) {
            res.json({ status: 'error', message: err });
        } else {
            if (data.length > 0) {
                res.json({ status: 'error', message: 'Date you select already booking' });
            } else {
                const checkExistingEmail = "SELECT * FROM booking WHERE email = ?";
                db.query(checkExistingEmail, [req.body.email], (err, emailData) => {
                    if (err) {
                        res.json({ status: 'error', message: err });
                    } else {
                        if (emailData.length > 0) {
                            res.json({ status: 'error', message: 'Email already exists' });
                        } else {
                            const sql = "INSERT INTO booking (checkindate, checkoutdate, firstname, lastname, email, phone) VALUES (?, ?, ?, ?, ?, ?)";
                            const values = [
                                req.body.checkindate,
                                req.body.checkoutdate,
                                req.body.firstname,
                                req.body.lastname,
                                req.body.email,
                                req.body.phone
                            ];
                            db.query(sql, values, (err, data) => {
                                if (err) {
                                    res.json({ status: 'error', message: err });
                                } else {
                                    res.json({ status: 'ok', message: 'User registered successfully' });
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});



app.get('/checkin', (req, res) => {
    const sql = 'SELECT checkindate, checkoutdate FROM booking';

    db.query(sql, (err, result) => {
        if (err) {
            res.json({ status: 'error', message: err });
        } else {
            res.json(result);
        }
    });
});

app.get('/user', (req, res) => {
    const userEmail = req.query.email; // รับค่าอีเมล์จากคำขอ

    // สร้างคำสั่ง SQL สำหรับการเลือกชื่อผู้ใช้โดยใช้อีเมล์เป็นเงื่อนไข
    const sql = 'SELECT * FROM users  WHERE email = ?';

    // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
    db.query(sql, [userEmail], (err, result) => {
        if (err) {
            // หากเกิดข้อผิดพลาดในการดึงข้อมูลจากฐานข้อมูล
            res.json({ status: 'error', message: err })
        } else {
            // หากไม่เกิดข้อผิดพลาด ส่งข้อมูลผู้ใช้กลับไปยังผู้ใช้
            res.json(result)
        }
    });
});





app.listen('3002', () => {
    console.log('server is running on port 3002')
})