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
// const {Web3} = require('web3')
// web3 1.x 버전인 경우
const Web3 = require('web3')
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

// 가나슈에 있는 주소들을 로드 
// 변수를 생성 
// const -> 데이터가 할당이되면 수정이 불가능 
// let -> 데이터가 할당이 되고 수정이 가능
let address
web3.eth.getAccounts(function(err, result){
    // 만약에 에러가 발생한다면
    if(err){
        console.log(err)
    }else{
        console.log(result)
        address = result
    }
})
console.log(address)
// api 생성
// port 번호가 3000임으로 기본 서버의 주소는 localhost:3000

// session data -> 임시로 데이터를 저장하는 공간 
// 일정시간이 지나면 데이터를 삭제
// session을 사용하기 위해서는 외부의 모듈이 필요
// 모듈의 이름은 express-session
const session = require('express-session')
// session의 설정 
app.use(
    session(
        {// 암호화키 : 특정한 데이터를 키를 이용하여 암호화 -> 복호화 
            secret : "asdgfgsanjda", 
            resave : false,
            saveUninitialized : false, 
            cookie :{
                // maxAge는 데이터를 저장하고 있는 시간 (1000 -> 1초)
                maxAge : 6000
            } 
        }
    )
)




// localhost:3000/ 로 요청이 들어오면 
app.get("/", function(req, res){
    // res.send('Hello World')
    // signin.ejs를 보여준다
    // session에 데이터가 존재하지 않는다면 signin을 렌더 
    console.log(req.session.login)
    if(!req.session.login){
        res.render("signin")
    }else{
        res.render('main', {
            "name" : req.session.login['1'], 
            "age" : req.session.login['2']
        })
    }
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
            // 로그인 성공 시 session에 data를 할당
            // session data는 req 안에 session에 데이터가 존재
            // req.session는 {}
            result.id = _id
            console.log(result)
            // result에 id 값을 추가 
            req.session['login'] = result
            /*
            req.session은 
            {
                "login" : {
                    "0" : password, 
                    "1" : name, 
                    "2" : age, 
                    "id" : _id
                }
            } 
            */ 
            // req.session['login']['id'] = _id
            /*
                        req.session은 
            {
                "login" : {
                    "0" : password, 
                    "1" : name, 
                    "2" : age, 
                    "id" : id
                }
            } 
            */

            // 서버가 유저에게 화면과 데이터를 같이 보내준다. 
            // main.ejs와 로그인 한 유저의 이름을 동시에 보내준다.
            // res.render('main', {
            //     "name" : result['1'], 
            //     "age" : result['2']
            // })
            res.redirect('/')
        } else {
            res.redirect('/')
        }
    })


    // res.render('main')


} )

// localhost:3000/update [get] 주소 생성
app.get('/update', function(req, res){
    // 회원 정보 수정 페이지로 이동
    res.render('update')
})

// localhost:3000/update2 [post] 주소 생성
app.post('/update2', function(req, res){
    // 유저가 보낸 데이터를 변수에 대입 
    const _id = req.body.input_id
    const _pass = req.body.input_pass
    const _name = req.body.input_name
    const _age = req.body.input_age
    console.log(_id, _pass, _name, _age)

    // smartcontract에 있는 update_user() 함수를 호출
    // 데이터를 수정하기때문에 tracsaction 이 발생
    smartcontract
    .methods
    .update_user(
        _id, 
        _pass, 
        _name, 
        _age
    )
    // send()? call()?
    .send(
        {
            from : '0xA600927c1217018e7a7A3E0eF0d45A42C6050713', 
            gas : 200000
        }
    )
    .then(function(receipt){
        console.log(receipt)
        res.redirect('/')
    })

})

// 2번 block = head(1번 블록 데이터를 해시화) + body(data) + footer(2번 블록의 데이터의 해시값)
// 3번 block = head(2번 블록 데이터를 해시화) + body(data) + footer(3번 블록의 데이터의 해시값)
// 웹서버 실행
app.listen(port, function(){
    console.log('Server Start')
})