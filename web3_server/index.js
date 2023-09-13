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

// console.log(contract_abi)
// console.log(contract_address)

// web3 모듈 로드 ver 4.x인 경우 
const {Web3} = require('web3')
// web3 1.x 버전인 경우
// const Web3 = require('web3')
// 컨트렉트가 배포가 된 네트워크(가나슈)의 주소를 등록
const web3 = new Web3(
    new Web3.providers.HttpProvider(
        'http://127.0.0.1:7545'
    )
)

// 네트워크에 배포된 contract를 로드 
const smartcontract = new web3.eth.Contract(
    contract_abi, 
    contract_address
)

// api 생성
// port 번호가 3000임으로 기본 서버의 주소는 localhost:3000

// localhost:3000/ 로 요청이 들어오면 
app.get("/", function(req, res){
    // res.send('Hello World')
    // signin.ejs를 보여준다
    res.render("signin")
})

// localhost:3000/signup [get] 주소
// 회원 가입 페이지를 렌더링
app.get("/signup", function(req, res){
    res.render('signup')
})

// localhost:3000/signup2 [get] 주소 생성
app.get('/signup2', function(req, res){
    // 유저가 입력한 데이터를 변수에 대입 
    // get 형태로 데이터를 보내주기 때문에 
    // req안에 query 안에 데이터가 존재
    const _id = req.query.input_id
    const _pass = req.query.input_pass
    const _name = req.query.input_name
    const _age = req.query.input_age
    console.log(_id, _pass, _name, _age)

    // contract에 있는 add_user()함수를 호출
    // add_user() -> 데이터의 변화가 존재 ->  transaction 발생
    // -> 수수료가 발생 -> 수수료를 지불할 지갑의 주소가 필요
    smartcontract
    .methods
    .add_user(
        _id, 
        _pass, 
        _name, 
        _age
    )
    .send(
        {
            // 수수료를 지불할 지갑의 주소
            from : '0xA600927c1217018e7a7A3E0eF0d45A42C6050713',
            // 가스 limit
            gas : 200000
        }
    )
    // 함수 호출이 실행
    .then(function(receipt){
        console.log(receipt)
        // 회원가입이 완료되면 로그인 화면으로 돌아간다. 
        res.redirect('/')
    })
})

// localhost:3000/login [post] 주소
app.post('/login', (req, res) => {
    // 유저가 보낸 데이터를 확인 
    // post 형태로 데이터를 보내주기 때문에 
    // req안에 body에 데이터가 담겨있다. 
    const _id = req.body.input_id
    const _pass = req.body.input_pass
    console.log(_id, _pass)
    // 스마트컨트렉트를 이용하여 회원 정보를 로드한 뒤
    // password가 맞는지 확인하고 맞으면 main 렌더링 
    // 맞지 않다면 로그인 화면으로 돌아간다. 

    // smartcontract에서 view_user() 함수를 호출
    // view 함수 -> 데이터의 변화가 존재하지 않는다 -> 수수료가 발생하지 않는다.
    smartcontract
    .methods
    .view_user(
        _id
    )
    .call()
    .then(function(result){
        // result는 view_user()함수를 호출하고 되돌려주는 리턴값이 저장된다. 
        // result는 데이터의 형태
        // { "0" : password, "1" : name, "2" : age }
        // 만약에 회원 정보가 존재하지 않는 아이디를 조회했을때는
        // {"0" : "", "1" : "", "2" : 0}
        
        //  로그인이 성공하는 조건 ? -> 해당하는 id가 존재해야하고 password가 맞아야지만 로그인이 성공
        // 유저가 입력한 password는 _pass 저장
        // contract에 있는 password는 result[0] 저장
        // 조건문 
        if ((_pass == result[0]) && (result[0] != "") ){
            // 서버가 유저에게 화면과 데이터를 같이 보내준다. 
            // main.ejs와 로그인 한 유저의 이름을 동시에 보내준다.
            res.render('main', {
                "name" : result['1'], 
                "age" : result['2']
            })
        } else {
            res.redirect('/')
        }
    })


    // res.render('main')


} )


// 웹서버 실행
app.listen(port, function(){
    console.log('Server Start')
})