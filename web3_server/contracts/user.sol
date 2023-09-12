// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract users{
    // 컨트렉트의 오너 변수를 생성
    address private owner;

    // 생성자 함수 생성
    constructor(){
        // 컨트렉트 배포자의 지갑 주소를 owner 변수에 대입
        owner = msg.sender;
    }

    // 구조체 생성
    struct user_info{
        string password;
        string name;
        uint8 age;
    }

    // 맵핑 데이터를 생성 
    // json의 형태와 흡사 key : value
    mapping (string => user_info) public user;

    /* 
        mapping 데이터를 json형태로 변환해서 생각
        {
            test : {
                    password : xxxx, 
                    name : xxxx, 
                    age : xxxx
                }, 
            test2 : {
                    password : xxxx, 
                    name : xxxx, 
                    age : xxxx
                }
        }
    */

    // modifier 함수 :  함수를 변경 -> 여러개의 함수를 결합해서 실행
    modifier checkOwner(){
        require(owner == msg.sender, 'Owner not match');
        _;  //결합되는 함수가 실행이 되는 부분
        // require를 실행하고 결합된 함수를 실행행
    }

    // 함수 생성 
    // mapping 데이터에 데이터를 추가 
    function add_user(
        string memory _id, 
        string memory _password, 
        string memory _name, 
        uint8 _age
    ) public checkOwner {
        // 함수를 호출하는 지갑의 주소가 owner가 아니라면 코드 실행을 중지
        // mapping에 데이터를 추가 
        user[_id].password = _password;
        user[_id].name = _name;
        user[_id].age = _age;
    }

    // mapping 데이터를 조회 하는 함수 생성
    function view_user(
        string memory _id
    ) view public returns(
        string memory, 
        string memory, 
        uint8
    ){
        return (
            user[_id].password, 
            user[_id].name,
            user[_id].age
        );
    }

}