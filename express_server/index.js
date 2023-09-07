// 변수를 하나 생성 
// js에서 변수를 생성
// js에서는 동적 타입의 변수 (데이터의 타입을 자동으로 지정)
// const, let 키워드를 사용해서 변수 생성
// const : 변경이 불가능한 변수
// let : 변경이 가능한 변수

// express 모듈을 로드 
const express = require('express')
// express class 생성
// class : 변수 + 함수의 집합
const app = express()

// 뷰파일들의 기본 경로를 설정
// __dirname : 현재 파일의 경로
app.set('views', __dirname+'/views')
// 뷰 파일들의 엔진을 어떤것을 사용할 것인가 지정
app.set('view engine', 'ejs')

// post 형태에서 데이터를 받아오기 위해서 설정 
// extended : false를 사용하게 되면 데이터 변환하는 엔진을 qs 모듈을 사용(express 내장)
// extended : true를 사용하게 되면 데이터 변환 엔진을 querystring 모듈을 사용(구버전 express에는 내장되어있지 않음)
app.use(express.urlencoded(
    {
        extended : false
    }
))

// api : 요청(웹 브라우져에서 주소창에 주소를 입력)을 보내고 응답(웹 서버에서 데이터를 보내준다.)이 온다
// api는 웹 주소를 생성
// localhost:3000 -> 웹서버의 기본 주소
// localhost:3000/ 주소를 생성
app.get("/", function(req, res){
    //req : 요청(request)
    //res : 응답(response)
    // res.send("Hello World")
    // localhost:3000/ 요청시에는 main.ejs파일을 응답으로 보내주겠다.
    // render(파일의 경로와 이름)
    res.render('main.ejs')
})

// api 추가 생성
// localhost:3000/second 주소를 생성
app.get('/second', function(req, res){
    // res.send('Second page')
    res.render('second')
})

// api 생성
// localhost:3000/login 주소를 생성
app.get('/login', function(req, res){
    res.render('login')
})

// login페이지에서 데이터를 보내주는 주소를 생성
// localhost:3000/signin [get] 주소 생성
app.get('/signin', function(req, res){
    // 유저가 보낸 데이터를 불러와서 변수에 대입
    console.log(req.query)
    const id = req.query.input_id
    const pass = req.query.input_pass
    console.log(id, pass)
    res.send('message')
})

// localhost:3000/signin2 [post] 주소를 생성
app.post('/signin2', function(req, res){
    // 유저가 입력한 데이터를 불러와서 변수에 대입 
    console.log(req.body)
    const id = req.body.input_id
    const pass  = req.body.input_pass
    console.log(id, pass)
    // 유저가 입력한 아이디가 test이고 (조건식1) 
    // 유저가 입력한 패스워드가 1234라면 (조건식2)
    // 로그인이 성공
    // 만약 아니라면 로그인이 실패
    if ( (id == 'test') & (pass == '1234') ){
        // 유저가 입력한 아이디와 패스워드가 모두 참인 경우 실행 할 코드 
        res.send('로그인 성공')
    }else{
        // 아이디와 패스워드 중 하나만 참인 경우, 모두 거짓인 경우 실행 할 코드
        res.send('로그인 실패')
    }
    // res.send('POST message')
})

// 웹서버를 실행
app.listen(3000, function(){
    console.log('Server Start')
})