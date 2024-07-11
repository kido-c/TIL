## 실행컨텍스트

```js
  // Execution context in ES5
ExecutionContext = {
  ThisBinding: <this value>,
  VariableEnvironment: { ... },
  LexicalEnvironment: { ... }
}

```

실행컨테스트는 두단계로 나뉘어진다. **생성, 실행 단계**

### [생성 단계]

- variableEnvironment(변수 환경) : 변수, 인수 및 함수 선언의 초기 저장소로 관리, var로 선언된 변수는 undefined 값으로 초기화됨 ( 호이스팅의 원인 )

- this의 값 결정
- 현재 단계에서는 lexicalEnvironmnet가 variableEnvironment의 복사본일 뿐 ( lexicalEnvironmnet가 === variableEnvironment )

### [실행 단계]

- 값이 할당
- lexicalEnvironmnet이 바인딩을 해결하는데 사용됨 ?? 무슨말인지 잘 모르겠음

## Lexical Environmnet ( 렉시컬 환경 )

> ### 딥다이브 정의
>
> 레시컬 환경은 식별자와 식별자에 바인딩된 값, 상위 스코프에 대한 참조를 기록하는 자료구조로 실행컨텍스트를 구성하는 컴포넌트이다.

> ### ECMAScript 정의
>
> 어휘 중첩 구조에 따라 식별자와 특정 변수 및 함수의 연결을 정의하는데 사용되는 사양 유형입니다.  
> A Lexical Environment is a specification type used to define the association of Identifiers to specific variables and functions based upon the lexical nesting structure of ECMAScript code.

레시컬 환경은 식별자와 식별자에 바인딩된 값, 상위 스코프에 대한 참조를 기록하는 자료구조로 실행컨텍스트를 구성하는 컴포넌트이다.

- 식별자
- 식별자에 바인딩된 값
- 상위 스코프에 대한 참조를 기록하는 자료구조

실행 컨텍스트 : 코드의 실행순서를 관리하기 위함  
렉시컬 환경 : 스코프와 식별자를 관리

lexical environment는 두가지 컴포넌트로 구성되어있습니다.

- 환경 레코드 ( environment record )
- 외부 ( 부모 ) lexical environment의 참조

ex)

```js
var x = 10;

function foo() {
  var y = 20;
  console.log(x + y); // 30
}

// Environment of the global context
globalEnvironment = {
  environmentRecord: {
    x: 10,
  },
  outer: null,
};

// Environment of the "foo" function
fooEnvironment = {
  environmentRecord: {
    y: 20,
  },

  outer: globalEnvironment,
};
```

실행컨텍스트 구조로 영역을 확장하여 살펴보면 다음과 같은 구조를 가집니다.

```js
function foo(a) {
  var b = 20;
}
foo(10);

// variableEnvironment의 environmnetRecord는 변수, 인수 및 함수선언을 위한 초기 저장소롤 사용
// 컨텍스트 실행단계에서 채워진다. ( b에 값이 할당 )
fooContext.VariableEnvironment = {
  environmentRocord: {
    argument: { 0: 10, length: 1, callee: foo },
    a: 10,
    b: undefined,
  },
  outer: globalEnvironment,
};

// 실행단계에서의 VE(variableEnvironment)
fooContext.VariableEnvironment = {
  environmentRocord: {
    argument: { 0: 10, length: 1, callee: foo },
    a: 10,
    b: 20,
  },
  outer: globalEnvironment,
};

// ! 초기단계에서 lexicalEnvironment는  VE의 복사본입니다.
// 실행 중인 컨텍스트에서 컨텍스트에 나타나는 식별자의 바인딩을 결정하는데 사용된다.
// ?? 식별자의 바인딩 ??
```

VE와 LE는 본질적으로 lexical environmnet 이다. _?? 무슨말일까 ??_

> 둘다 비슷한 구조이지만 관리하는 데이터가 다르다?  
> VE는 var로 선언된 식별자를 관리  
> LE는 let, const, function 으로 선언된 식별자를 관리

두개 모두 컨텍스트에서 생성된 내부 함수에 대한 외부 바인딩을 정적으로 ( 생성 단계에서 ) 캡쳐합니다.

> **-> 이는 클로저를 형성한다.**
> 왜 그럴까.... 코드의 순서상 함수의 실행을 만나면 컨텍스트를 생성한다.  
> 컨텍스트를 생성하면 아래와 같은 VE와 LE를 생성한다.  
> outer에 외부 환경을 바인딩 시킨다.  
> 바인딩된 외부 환경에 접근해서 외부 변수에 접근이 가능하다. ( 클로저 ?)

```js
fooContext.VariableEnvironment = {
  environmentRocord: {
    argument: { 0: 10, length: 1, callee: foo },
    a: 10,
    b: undefined,
  },

  // 컨텍스트 생성 단계에서 외부를 바인딩한다. ( 캡쳐한다. )
  outer: globalEnvironment,
};
```

## 클로저의 이해

클로저를 이해하기 위해서는 실행컨텍스트에서 스코프체인이 어떻게 생성되는지 알아보아야한다.  
실행컨텍스트에서 식별자를 확인하기 위해서 실행컨텍스트 > lexical environment > environmnetRecord를 확인합니다.  
식별자가 현재 environmentRecord에서 확인되지 않으면 프로세스는 outer를 따라 외부 environmentRecord에서 계속 진행됩니다.  
찾는 식별자를 찾을 때까지 해당 프로세스가 반복됩니다. 그러다가 찾지 못하면`ReferenceError`가 발생합니다.

> 프로토타입 Lookup 체인과 비슷한 프로세스입니다.

lexical environment은 컨텍스트 생성단계에서 외부 바인딩( outer )를 캡쳐한다. ( 어휘적으로, lexically )  
_아무리 한국적으로 표현해서 이해하려고 해도 풀어 말하기가 힒들다. 그림은 그려지지만_

- ### 클로저

이러한 바인딩 과정은 컨텍스트(함수) 생성과정에서 결정되기 때문에 어디에서 실행되는가는 관계가 없다.

```js
// global context 생성
var a = 10;

// foo context 생성
function foo() {
  console.log(a);
}

// bar context 생성
function bar() {
  var a = 20;
  foo();
}

bar();
```

foo 함수가 a를 찾아가는 과정은 다음과 같다.

1. foo 함수는 자신의 컨텍스트에 LE 바인딩되어잇는 a를 찾는다.
2. 하지만 foo 컨텍스트에는 a가 없다.
3. 그렇다면 LE outer에 바인딩 되어있는 global 컨텍스트로 이동한다.
4. global 컨텍스트의 LE에 a 가 바인딩되어있는지 확인한다.
5. global 컨텍스트에 저장된 a의 바인딩 값인 10을 가지고 와서 console.log(10)을 실행한다.

```js
// 다음과 같은 형태로 저장되어 있을 것이다.

-- foo.[[LexicalEnvironment]].[[Record]] --> not found

-- foo.[[LexicalEnvironment]].[[Outer]] --> global

-- global.[[LexicalEnvironment]].[[Record]] --> found 10
```

foo 함수가 bar 내부에서 실행되어 bar 내부에 선언되어있는 `var a = 20;`의 값을 가져올 것 같지만,  
앞서 설명한 것 처럼 실행이 어디서 발생했는지는 관계없이 선언이 어디에서 되었는지가 중요하다.

예시2)

```js
function outer() {
  let id = 1;

  // inner 함수는 여기서 선언되어있다.
  // outer에 outer 컨텍스트 바인딩
  return function inner() {
    console.log(id);
  };
}

const innerFunc = outer();
innerFunc();
```

```js
-- inner.[[LexicalEnvironment]].[[Record]] --> not found

-- inner.[[LexicalEnvironment]].[[Outer]] --> outer

-- outer[[LexicalEnvironment]][[Record]] --> found 1
```
