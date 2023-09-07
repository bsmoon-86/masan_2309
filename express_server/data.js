// [] : 배열 데이터
// {} : json 데이터

_list = [10, 20, 30, 40]
// _list에는 4의 데이터를 가지고있는 배열

// _list에서 30만 추출하려면?
// 배열데이터명[위치값]
// 위치값은 0부터 시작
console.log(_list[2])

// json 데이터
_json = {
    'id' : 'test', 
    'pass' : '1234', 
    'phone' : '01012345678', 
    '01' : '1111', 
    'add ress' : 'Seoul'
}

// _json에서 'test'만 추출하려면?
// json데이터명[키값]
// json데이터명.키값 : 키값의 시작이 문자여야하고 키값에 공백이 존재하면 사용이 불가능
console.log(_json['id'])
console.log(_json.id)

console.log(_json['01'])
// console.log(_json.01) 키값이 숫자라면 사용 불가

console.log(_json['add ress'])
// console.log(_json.add ress) 키 값 중간에 공백이 존재하면 사용 불가능

// Database에서 데이터를 불러오는 경우

// sample 
sample = [
    {
        'id' : 'test', 
        'pass' : '1234'
    }, 
    {
        'id' : 'test2', 
        'pass' : '1111'
    }, 
    {
        'id' : 'test3', 
        'pass' : '0000'
    }
]

// sample에서 'test2'라는 항목을 출력하려면?
console.log(sample[1])
console.log(sample[1]['id'])