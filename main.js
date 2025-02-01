// === 환경 변수 로드 (최우선적으로 실행) ===
require('dotenv').config(); // 환경 변수 로드

// === 필요한 패키지 임포트 ===
const express = require('express');
var path = require('path');
const mysql2 = require('mysql2/promise');
const nodemailer = require('nodemailer');

// === 환경 변수 확인 및 서버 포트 설정 ===
const app = express();
const PORT = process.env.PORT || 8080;
console.log('Server running on:', PORT);

app.use('/resources', express.static(path.join(__dirname, '/resources')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// === MySQL 연결 설정 ===
const _pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    dateStrings: 'date',
    connectionLimit: 10,
    timezone: '+09:00',
    charset: 'utf8mb4',
});

// === 유틸 함수 ===
async function asyncQuery(sql, params = []) {
    const conn = await _pool.getConnection();
    try {
        const [rows] = await conn.query(sql, params);
        return rows;
    } catch (err) {
        console.error(`쿼리 오류: ${err}`);
    } finally {
        conn.release();
    }
}

// 메인
app.get('/', async (req, res) => {
    try {
        res.render('index');
    } catch (error) {
        console.error(error);
        res.status(500).send('error');
    }
});

app.get('/index', async (req, res) => {
    try {
        res.render('index');
    } catch (error) {
        console.error(error);
        res.status(500).send('error');
    }
});

// 회사소개 - 회사소개
app.get('/about/aboutCompany', async (req, res) => {
    try {
        res.render('about/aboutCompany');
    } catch (error) {
        console.error(error);
        res.status(500).send('error');
    }
});

// 회사소개 - 대표이사
app.get('/about/aboutCeo', async (req, res) => {
    try {
        res.render('about/aboutCeo');
    } catch (error) {
        console.error(error);
        res.status(500).send('error');
    }
});

// 회사소개 - 연혁
app.get('/about/aboutHistory', async (req, res) => {
    try {
        res.render('about/aboutHistory');
    } catch (error) {
        console.error(error);
        res.status(500).send('error');
    }
});


// 사업안내 - AX/DX 컨설팅
app.get('/service/axDx', async (req, res) => {
    try {
        res.render('service/axDx');
    } catch (error) {
        console.error(error);
        res.status(500).send('error');
    }
});

// 사업안내 - 디지털 솔루션
app.get('/service/processOptimization', async (req, res) => {
    try {
        res.render('service/processOptimization');
    } catch (error) {
        console.error(error);
        res.status(500).send('error');
    }
});

// 사업안내 - 스마트 제조 사업
app.get('/service/smartManufacturing', async (req, res) => {
    try {
        res.render('service/smartManufacturing');
    } catch (error) {
        console.error(error);
        res.status(500).send('error');
    }
});

// 사업안내 - App/Web
app.get('/service/appWeb', async (req, res) => {
    try {
        res.render('service/appWeb');
    } catch (error) {
        console.error(error);
        res.status(500).send('error');
    }
});

// 솔루션 - MES
app.get('/solutions/mes', async (req, res) => {
    try {
        res.render('solutions/mes');
    } catch (error) {
        console.error(error);
        res.status(500).send('error');
    }
});

// 고객지원 - 가격안내
app.get('/contact/pricingInfo', async (req, res) => {
    try {
        res.render('contact/pricingInfo');
    } catch (error) {
        console.error(error);
        res.status(500).send('error');
    }
});

// 고객지원 - 문의하기
app.get('/contact/contact', async (req, res) => {
    try {
        res.render('contact/contact');
    } catch (error) {
        console.error(error);
        res.status(500).send('error');
    }
});

// 고객지원 - 공지사항
app.get('/contact/board', async (req, res) => {
    try {
        res.render('contact/board');
    } catch (error) {
        console.error(error);
        res.status(500).send('error');
    }
});

// 폼 제출 처리
app.post('/contact/contact', (req, res) => {
    const { name, company, email, phone, inquiry_type, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        // subject: `New Inquiry from ${name}`,
        subject: `${name}님으로부터 새로운 문의가 도착했습니다.`,
        text: `
        <문의 내용>
            - 성함: ${name}
            - 회사명: ${company}
            - E-mail: ${email}
            - 연락처: ${phone}
            - 관심 솔루션: ${inquiry_type}
            - 문의사항: ${message}
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent:', info.response);
        res.send(`
            <script>
                alert('메일이 성공적으로 전송되었습니다.');
                window.location.href = '/contact/contact';
            </script>
        `);
    });
});

// 메일 전송 설정
const transporter = nodemailer.createTransport({
    host: 'smtp.naver.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER, // 발신자 이메일
        pass: process.env.EMAIL_PASS  // 발신자 이메일 비밀번호
    }
});

// === 서버 실행 ===
app.listen(PORT, "0.0.0.0", () => {
    console.log(`server started on PORT ${PORT} // ${new Date()}`);
});