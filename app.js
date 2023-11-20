const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

mongoose.connect("mongodb://localhost:27017/shopping-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

const User = require("./models/user.js");
// 회원가입
router.post("/users", async (req, res) => {    // database에 접근하기 때문에 async사용
    const { nickname, email, password, confirmPassword } = req.body;  // 들어오는 4개의 데이터를 body에서 추출 , 객체 구조분해할당

    // 1. 패스워드, 패스워드 검증 값이 일치하는가
    // 2. email에 해당하는 사용자가 있는가
    // 3. mickname에 해당하는 사용자가 있는가
    // 4. DB에 데이터를 삽입

    // 1.
    if (password !== confirmPassword) {
        res.status(400).json({
            errorMessage: "password와 confirmPassword가 일치하지 않습니다"
        });
        return; // if문 실행 후 다은 코드 실행을 막기 위해 return
    }

    // 2.
    // 3.
    const existUser = await User.findOne({  // user 찾기
        $or: [{ email: email }, { nickname: nickname }] // $or => [] 안에 있는 값 중에 하나라도 일치하면 보여줌
    });

    if (existUser) {    // existuser에 데이터가 있으면
        res.status(400).json({
            errorMessage: "Email이나 Nickname이 이미 사용 중입니다."
        });
        return;
    }

    // 4.
    const user = new User({ nickname, email, password });
    await user.save();  // 윗 라인의 저장되어있는 데이터로 실제 db에 저장

    res.status(201).json({}); // 실제 데이터가 생성이 되었을 때 status(201)
});

// 로그인
router.post("/auth", async (req, res) => { // db에 접근하기 때문에 async / /auth라는 경로는 '사용자가 자신의 정보를 인증한다'라는 기능에 자주 사용되는 경로(로그인)
    const { email, password } = req.body; // post를 쓴 이유 : post는 body를 쓸 수 있고 get처럼 url에 표현하는것이 아니기때문에 좀 더 보안적/ 인증정보를 "생성" 해서 받아온다고 보면 post가 적합

    const user = await User.findOne({ email });

    // 1. 사용자가 존재하지 않거나
    // 2. 입력받은 password와 사용자의 password가 다를 때 에러메시지가 발생해야한다.
    if (!user || password !== user.password) {
        res.status(400).json({
            errorMessage: "사용자가 존재하지 않거나, 사용자의 password와 입력받은 password가 일치하지 않습니다"
        });
        return;
    }

    const token = jwt.sign({ userId: user.userId }, "sparta-secret-key") // user.userId는 user.js의 user._id와 동일 / sparta-secret-key라는 키로 암호화

    res.status(200).json({
        "token": token,
    })
})

const authMiddleware = require("./middlewares/auth-middleware.js");

// 내 정보 조회 api
router.get("/users/me", authMiddlewar, async (req, res) => {
    res.json({ user: res.locals.user });
})

app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));

app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});