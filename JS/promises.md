## Promise 생성하기

`new Promise()` 키워드로 promise를 성생하면 Promise 객체와 Promise Capability Record가 생성된다.
Promise 객체는 Promise 상태를 나타내는 여러 내부 슬롯이 존재합니다.  
Promise Capability Record는 Promise를 캡슐화하고 Promise의 이벤트적 실행을 제어, 비동기 작업을 하기위한 여러 추가기능을 추가한다. `이해가 잘 안되는 부분`

- promise 생성

```js
new Promise((resolve, reject) => {});
```

peding 상태 promise object

```js
// promises object
{
    [[PromiseState]] : 'pending'
    [[PromiseResult]]: undefined,
    [[PromiseFulfillReactions]] : null,
    [[PromiseRejectReactions]]:null,
    [[PromiseIsHandled]]:true | false
}
```

- 성공

```js
new Promise((resolve, reject) => {
  resolve("Done!");
});
```

resolve 상태 promise object

```js
// promises object
{
    [[PromiseState]] : 'fulfilled'
    [[PromiseResult]]: 'Done!',
    [[PromiseFulfillReactions]] : null,
    [[PromiseRejectReactions]]:null,
    [[PromiseIsHandled]]:true | false
}
```

- 실패

```js
new Promise((resolve, reject) => {
  reject("Fail!");
});
```

reject 상태 promise object

```js
// promises object
{
    [[PromiseState]] : 'rejected'
    [[PromiseResult]]: 'Fail!',
    [[PromiseFulfillReactions]] : null,
    [[PromiseRejectReactions]]:null,
    [[PromiseIsHandled]]:true | false
}
```

## what is PromiseFulfillReactions & PromiseRejectReactions

Promise Reaction Record

## Promise 동작 프로세스

```js
new Promise((resolve) => {
  setTimeout(() => resolve("Done!"), 100);
}).then((result) => console.log(result));
```

간단한 Pomise동작이 어떠한 흐름으로 동작하고 결과를 나타내는지 알아보자.

> 여기서 활용되는 구조?
>
> - callstack
> - WebAPIs
> - Event Loop
> - Task Queue
> - Microtask Queue

1. new Promise 생성자가 callStack에 쌓인다.
   - promise object와 promise capability record가 생성된다.
2. `(resovle) => {...}` 생성자 내부 함수가 다음 callstack에 쌓인다.
3. setTimeout이 callstack에 쌓인다.
4. setTimeout은 WebAPIs에 전달되어 실행된다. (10ms)
5. WebAPIs 전달로 Promise 생성자 실행은 모두 종료 되었으므로 콜스택의 작업은 제거된다.
6. `then()` 이 실행되어 callstack에 쌓인다.
7. promiseObject.`[[PromiseFulfillReactions]]` 에 `[[Handler]]`로 then 내부 함수가 등록된다.

   - ````js
     {
          [[PromiseState]] : 'pending'
          [[PromiseResult]]: undefined,
          [[PromiseFulfillReactions]] : {
            [[Handler]] : result => console.log(result)
          },
          [[PromiseRejectReactions]]:null,
          [[PromiseIsHandled]]:true | false
      }
           ```
     ````

8. `then()` 이 callstack에서 제거된다.
9. 10ms뒤에 WebAPIs에서 반환된 `()=> resolve('Done!')` 이 Task Queue에 등록된다.
10. callstack이 비어있으므로 Event Loop는 Task Queue에 있는 작업을 꺼내어 callstack에 push 한다.
11. `()=> resolve('Done!')`이 callstack에 쌓인다.
12. `resolve('Done!')` 이 callstack에 쌓인다.
    - resolve의 실행으로 promiseObject.`[[PromiseState]]`가 pending에서 fulfilled로 바뀐다.
    - promiseObject.`[[PromiseResult]]`에 결과가 반영된다.
    - ```js
      {
           [[PromiseState]] : 'fulfilled'
           [[PromiseResult]]: 'Done!',
           [[PromiseFulfillReactions]] : {
             [[Handler]] : result => console.log(result)
           },
           [[PromiseRejectReactions]]:null,
           [[PromiseIsHandled]]:true | false
       }
      ```
13. `[[Handler]]`에 등록되어있던 함수가 Microtask Queue에 등록된다.
14. resolve의 실행이 완료되었으므로 callstack이 비워진다.
15. Event Loop는 callstack이 비워졌으므로 Microtask Queue에 등록된 작업을 call stack으로 push한다.
16. `result => console.log(result)` 가 callstack에 쌓인다.
17. `console.log(result)` 가 callstack에 쌓인다.
18. promiseObject.`[[PromiseResult]]`에 등록되어잇는 `Done!`을 참조하여 console.log('Done!')을 실행한다.
