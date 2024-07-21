# async - await 뜯어보기

기본적으로 알고 있는 사실: event loop는 callstack이 비어있다면, microtask queue 또는 task queue에 있던 작업들을 push 한다.

```js
const promiseOne = () => Promise.resolve("One!");

async function asyncFunc() {
  console.log("in function!");
  const res = await promiseOne();
  console.log(res);
}

console.log("before func");
await asyncFunc();
console.log("finish func");

// 실행 결과
// 1. before func
// 2. in function!
// 3. One!
// 4. finish func
```

생각 했던 callstack 적재 순서

1. console.log("before func"); -> pop
2. asyncFunc();
3. console.log("in function!");
4. promiseOne();
   - promise WebAPI 전달
   - 결과 Micro task queue 적재
5. promiseOne() pop
6. console.log("finish func"); -> pop
7. call stack empty
8. event loop 돌면서 Micro task queue 작업 ... 이라고 생각했는데 반환받은 res를 console.log(res)할 myFunc 컨택스트가 없어보이는데...

의문점이 부분을 차치하더라고 console.log("finish func") 보다 console.log("One!"); 이 먼저 실행되지는 못할 것 같다. callstack이 비어있지 않는 상태이기 때문에 Micro task queue 작업이 callstack으로 들어올 수 없다.

<br/>

하지만 실제로 동작하는 방식이 보여지는 것과 다르기 때문에 그렇게 동작하는 것이다.  
`await` 키워드 다음에 나오는 동일라인의 코드들은 promise `then` handler의 콜백함수로 들어간다.

```js
let x = await bar();
console.log(x);
console.log("Done");
```

해당 코드들이 실제로는 다음과 같이 동작하는 모습니다.

```js
bar().then((res) => {
  console.log(x);
  console.log("Done");
});
```

async-await에 대한 아티클을 자주 보이는 설명으로 async-await는 promise.then( )메소드를 사용하지 않고 비동기 코드를 작성할 수 잇게 해주는 문법적익 편의기능(syntactic sugar)이다.

실제 동작을 처음 코드에 적용해보면,

```js
const promiseOne = () => Promise.resolve("One!");

function asyncFunc() {
  console.log("in function!");
  return promiseOne().then((res) => console.log(res));
}

console.log("before func");
syncFunc().then(() => console.log("finish func"));
```

해당 코드로 callstack 적재 과정을 살펴보면,

1. **console.log("before func"); -> pop**
2. **syncFunc()**
3. **console.log("in function!"); -> pop**
4. **promiseOne()**
   - promise WebAPI 전달
   - 결과 Micro task queue 적재
5. **then((res) => console.log(res));**
   - 내부 콜백함수 promise object에 등록
6. **promiseOne() pop**
7. callstack empty
8. resolve('Done')
   - 내부 콜백함수 promise object에 등록 ( 상태 : fulfilled, Result: 'One!')
   - [[Handler]]에 등록되어있는 (res) => console.log(res) Micro task queue 등록
9. **resolve('Done') pop**
10. callstack empty
11. **(res) => console.log(res)**
12. **console.log('One!') -> pop**
13. **(res) => console.log(res) pop**
14. syncFunc()의 반환값 promise
    - promise WebAPI 전달
    - 결과 Micro task queue 적재
15. then(() => console.log('finish func'));
    - 내부 콜백함수 promise object에 등록
16. **syncFunc() pop**
17. callstack empty
18. [[Handler]]에 등록되어있는 () => console.log('finish func') Micro task queue 등록
19. event loop 가 Micro task queue에 있는 작업 callstack push
20. **() => console.log('finish func')**
21. **console.log('finish func') -> pop**
22. **() => console.log('finish func') pop**
23. finish!!
