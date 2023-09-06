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

// 웹서버를 실행
app.listen(3000, function(){
    console.log('Server Start')
})