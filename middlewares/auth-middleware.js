const User = require("../schemas/user.js");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {   // 비동기
    const { authorization } = req.headers;  // jwt토큰 가져오기
    console.log(authorization);
    const [authType, authToken] = authorization.split(" ");
    // authType : Bearer
    // authToken : 실제 jwt 값이 들어온

    // console.log([authType, authToken]);

    if (authType !== "Bearer" || !authToken) {    // Bearer 타입이 아닐 때, Bearer 토큰이 비어있을 때
        res.status(400).json({
            errorMessage: "로그인 후 사용이 가능한 API 입니다"
        });
        return;
    }

    try {
        // 복호화 및 검증
        const { userId } = jwt.verify(authToken, "sparta-secret-key")   // app.js에서 암호화 한 키: sparta-secret-key
        const user = await User.findById({ userId });     // User라는 모델 안에 있는 userId 값 찾기
        res.locals.user = user;  // local.user에 할당 / 굳이 데이터베이승서 사용자 정보를 가져오지 않게 / 이렇게 담아둔 값은 응답 값을 보내고 소멸
        next(); //middleware다음으로 넘김
    } catch (error) {   // 검증 실패시 
        res.status(400).json({
            errorMessage: "로그인 후 사용이 가능한 API 입니다."
        })
        return;
    }
}