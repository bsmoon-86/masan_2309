// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// contract를 생성
contract test{
    // 변수 선언
    address owner;
    // 변수 선언과 동시에 값을 대입
    uint16 a = 100;

    // 생성자 함수
    // 해당하는 컨트렉트가 배포(deploy)될 때 최초의 한번만 실행이 되는 특수한 함수
    constructor(){
        // msg.sender : 배포를 하는 지갑 주소
        owner = msg.sender;
    }

    // 함수 생성 
    // function 함수명(매개변수) 가시성옵션 { 실행될 코드 } 
    function change_a(uint16 _val) public {
        // 조건문 
        if (a < 150){   // a가 150보다 작은 경우
            a = a + _val;
        }else {
            a = a - _val;
        }
        // a라는 변수가 변화하는 함수 
        // ( 데이터가 변화 -> transaction 발생 -> 수수료 발생)
    }

    // 함수 생성 ( 뷰 함수 -> 어떠한 데이터를 보여주는 함수 )
    // function 함수명(매개변수) view 가시성옵션 returns(되돌려줄 데이터의 타입){}
    function view_a() view public returns(uint16) {
        // a라는 변수를 되돌려준다. 
        return(a);
    }

    // view 함수 생성
    function view_owner() view public returns(address){
        return (owner);
    }
}