// express 모듈을 로드 
const express = require('express')
const app = express()
// 웹서버 포트 번호를 변수에 대입
const port = 3000

// ejs 파일들의 기본 경로를 설정 
// __dirname : 현재 파일의 경로
app.set('views', __dirname+"/views")
// 뷰 파일 엔진 설정
app.set('view engine', 'ejs')

// post방식으로 데이터를 받을때 json의 형태를 이용하여 데이터를 받아온다 
app.use(express.urlencoded({
    extended : false
}))

// 절대 경로
// 절대적인 주소 (c:/users/documents, url[www.google.com])
// 환경이 변하더라도 같은 위치를 지정

// 상대 경로
// 상대적인 주소(현재 파일에서 상위로 이동할지 하위 이동할지를 지정)
// ./ : 현재 파일의 경로
// ../ : 상위 폴더로 이동
// 폴더명/ : 하위 폴더로 이동

// contract의 정보가 담겨있는 json파일을 로드
// index.js파일이 있는 경로(./)에서 
// build라는 하위폴더 이동(build/) -> contracts 하위 폴더로 이동(contracts/)
// -> users.json
const contract_info = require("./build/contracts/users.json")
// 컨트렉트 정보중에 contract address, contract abi만 따로 추출

// const contract_abi = contract_info['abi']
const contract_abi = contract_info.abi

// contract address
// const contract_address = contract_info['networks']['5777']['address']
const contract_address = contract_info.networks['5777'].address

console.log(contract_abi)
console.log(contract_address)


// api 생성
// port 번호가 3000임으로 기본 서버의 주소는 localhost:3000

// localhost:3000/ 로 요청이 들어오면 
app.get("/", function(req, res){
    res.send('Hello World')
})

// 웹서버 실행
app.listen(port, function(){
    console.log('Server Start')
})