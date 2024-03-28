function RegisterValidation(values) {

    let error = {}
    const email_pattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // เช็ค firstname
    if (values.firstname == '') {
        error.firstname = 'โปรดกรอกชื่อจริง'
    } else {
        error.firstname = ''
    }
    // end 

    // เช็ค lastname
    if (values.lastname == '') {
        error.lastname = 'โปรดกรอกนามสกุล'
    } else {
        error.lastname = ''
    }
    // end

    // เช็ค email 
    if (values.email == '') {
        error.email = 'โปรดกรอกอีเมล'
    } else if (!email_pattern.test(values.email)) {
        error.email = 'รูปแบบอีเมล์ไม่ถูกต้อง'
    } else {
        error.email = ''
    }
    //  end

    // เช็ค password 
    if (values.password == '') {
        error.password = 'โปรดกรอกรหัสผ่าน'
    } else if (!password_pattern.test(values.password)) {
        error.password = 'รุปแบบรหัสผ่านไม่ถูกต้อง'
    } else if (values.password != values.confirmPassword) {
        error.password = 'รหัสผ่านไม่ตรงกัน'
    } else {
        error.password = ''
    }
    // end 

    // เช็ค confirmpassword
    if (values.confirmPassword == '') {
        error.confirmPassword = 'โปรดยืนยันรหัสผ่าน'
    } else {
        error.confirmPassword = ''
    }
    // end

    // เช็ควันที่ที่จองห้องพัก
    let currentdate = new Date();
    currentdate.setHours(0, 0, 0, 0);

    if (values.checkindate === '') {
        error.checkindate = 'โปรดเลือกวันที่ที่ต้องการจอง';
    } else {
        const checkinDate = new Date(values.checkindate);
        checkinDate.setHours(0, 0, 0, 0);

        if (checkinDate.getTime() < currentdate.getTime()) {
            error.checkindate = 'วันที่ที่ต้องการจองต้องเป็นวันนี้หรือมากกว่า';
        } else if (checkinDate.getTime() === currentdate.getTime()) {
            error.checkindate = '';
        } else {
            error.checkindate = '';
        }
    }
    //  end

    // เช็ควันที่ที่เช็คเอ้าท์
    if (values.checkoutdate === '') {
        error.checkoutdate = 'โปรดเลือกวันที่ที่ต้องการเช็คเอ้าท์';
    } else if (values.checkoutdate < values.checkindate) {
        error.checkoutdate = 'วันที่เช็คเอ้าท์ต้องมากกว่าวันที่ที่เช็คอิน';
    } else if (values.checkoutdate === values.checkindate) {
        error.checkoutdate = 'วันที่เช็คเอ้าท์ต้องไม่ใช่วันเดียวกับวันที่เช็คอิน';
    } else {
        error.checkoutdate = '';
    }

    if (values.phone === '') {
        error.phone = 'โปรดกรอกเบอร์โทร'
    } else {
        error.phone = ''
    }
    // end



    return error;

} export default RegisterValidation;