# You Might Not Need an Effect

> useEffect가 필요하지 않을 수도 있습니다 : [참조 링크](https://react.dev/learn/you-might-not-need-an-effect#)

크게 useEffect가 굳이 필요하지 않는 경우는 다음과 같은 2가지 케이스가 있을 수 있다.

- 랜더링을 위한 데이터를 변환하는 경우
- 사용자 이벤트를 처리하기 위해 사용하는 경우

## 구체적인 예시

### 1. props 또는 state에 따른 state 업데이트

```jsx
function Form() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    setFullNmae(firstName + " " + lastName);
  }, [firstName, lastName]);
}
```

해당 코드는 firstName과 lastName이 변경될 때마다 fullName을 업데이트한다.

예상해볼 수 있는 렌더링 과정은 다음과 같다.

1. firstName(or lastName) 업데이트로 인한 리랜더링
2. firstName(or lastName) 업데이트로 인한 useEffect 내부 fullNmae 업데이트
3. fullNmae 업데이트로 인한 리랜더링

fullName은 단순히 firstName과 lastName의 조합을 보여주는 것인데 상태로 관리하여 불필요한 useEffect와 리랜더링을 야기시킨다.

이를 useEffect와 상태를 제거하면 다음과 같이 수정할 수 있다.

```jsx
// code refactoring

function Form() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const fullName = firstName + " " + lastName;
}
```

fullName을 firstName(or lastName) 변경으로 인한 리랜더링 시 계산시켜주면 된다.

### 2. 비용이 많이 드는 연산 캐싱 작업

```jsx
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState("");

  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisible(getFilteredTodos(todos, filter));
  }, [todos, filter]);
}
```

위의 예시와 마찬가지로 props 즉 부모 컴포넌트에서 전달받은 상태를 계산하여 보여주는 것이기 때문에 굳이 useEffect로 처리하지 않아도 된다.

```jsx
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState("");

  const visibleTodos = getFilteredTodos(todos, filter);
}
```

만약 getFilteredTodos가 계산 비용이 많이 드는 작업이라면 props 변경이 아닌 newTodo 상태 변경으로 불필요하게 다시 계산될 수 있는 가능성이 있다.  
그럴경우 계산 결과에 대한 memoization을 하여 비용을 줄일 수 있다.

```jsx
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState("");

  // props todos, filter값이 변경될 때만 다시 계산
  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
}
```

### 3. props가 변경될 때 모든 상태 재설정

```jsx
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState("");

  useEffect(() => {
    setComment("");
  }, [userId]);
  // ...
}
```

디테일 페이지와 비슷한 느낌, userId에 따라 profile을 보여주는 컴포넌트이지만 다른 userId의 컴포넌트를 이동했을 때
comment가 재설정되지 않기 때문에 comment 초기화가 필요하다.  
초기화를 위해서 useEffect를 사용하여 초기화를 진행한다면, 이전 userId값에 대한 데이터를 랜더링하고 이후 업데이트된 userId에 대한 데이터를 랜더링하는 불필요한 렌더링이 발생할 수 있다.

그래서 react에게 해당 컴포넌트는 다른 컴포넌트임을 명시해주는 key값을 전달하면서 보완할 수 있다.

```jsx
export default function ProfilePage({ userId }) {
  // 다른 컴포넌트임을 명시적으로 표시
  return <Profile userId={userId} key={userId} />;
}

function Profile({ userId }) {
  const [comment, setComment] = useState("");
  // ...
}
```

### 4. Props가 변경됭 때 몇몇의 상태를 조정

위의 상황과 비슷한 상황이다.  
props items이 바뀔때 마다 선택한 item들을 초기화 해줘야한다.

```jsx
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    setSelection(null);
  }, [items]);
}
```

- useEffect 제거

```jsx
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 이전 items와 지금 itmes가 동일한지 비교
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

하지만 해당 로직은 어색하고 그다지 유용한 패턴 같아 보이지 않는다.
계속 적용되는 개념이 상태를 조합해서 데이터를 만들 수 있다면, 그를 위한 상태를 관리하지 않아도 된다.

```jsx
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // 계산할 수 있다면 계산하여 처리하는 것이 좋다.
  const selection = items.find((item) => item.id === selectedId) ?? null;
  // ...
}
```

### 5. 이벤트헨들러간의 로직 공유

```jsx
function ProductPage({ product, addToCart }) {
  // handleBuyClick, handleCheckoutClick 헨들러 함수를 통해 cart를 업데이트한다.
  // 그로 인해 알림을 띄운다.
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo("/checkout");
  }
  // ...
}
```

하지만 만약 페이지 이동을 통해 다른 상품 페이지를 이동했을 경우 이미 들어있는 cart데이터로 인해 예기치 않은 알림이 일어날 수 있다.

앞서 설명한 것 처럼 카트를 추가하는 것은 유저의 동작으로 인해 발생하는 행동이다. 이는 useEffect보다는 헨들러 함수로 해당 로직을 작성하는 것이 좋다.

```jsx
function ProductPage({ product, addToCart }) {
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  // click 할 때마다 알림 발생
  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo("/checkout");
  }
  // ...
}
```

### 6. POST 요청 보내기

어떠한 상태값의 업데이트로 인한 POST요청을 보내는 로직은 안티 패턴이 될 수 있다.
useEffect를 적용하기 전에 다음과 같은 관점에서 해당 로직을 어디에 배치할지 고려하면 좋다.

- 어떠한 특정 상호작용 ( 버튼 클릭, form 제출 등 )에 의해서 발생되는 경우 -> 이벤트 헨들러 함수에 배치
- 유저가 화면에서 어떠한 component를 보는 것으로 인해 발생하는 겨우 -> useEffect에 배치

```jsx
function Form() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // 유저가 form component를 보는 것으로 인해 요청을 보내야하는 경우
  useEffect(() => {
    post("/analytics/event", { eventName: "visit_form" });
  }, []);

  // 유저가 특정 상호작용( form 제출 ) 로 인한 post요청은 이벤트 헨들러 함수 내부에 위치하는 것이 좋다.
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post("/api/register", jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

코드 수정

```jsx
function handleSubmit(e) {
  e.preventDefault();
  post("/api/register", { firstName, lastName });
}
```

### 7. 계산 체이닝

상태값들의 업데이트에 따라 연달아 상태를 변경하는 로직이 필요할 수 있다.

```jsx
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // card -> goldCardCount 업데이트
  // goldCardCount -> round 업데이트
  // round -> isGameOver 업데이트
  // 연쇄적으로 상태 업데이트 발생

  // card -> goldCardCount 업데이트
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount((c) => c + 1);
    }
  }, [card]);

  // goldCardCount -> round 업데이트
  useEffect(() => {
    if (goldCardCount > 3) {
      setRound((r) => r + 1);
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  // round -> isGameOver 업데이트
  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert("Good game!");
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error("Game already ended.");
    } else {
      setCard(nextCard);
    }
  }
}
```

이러한 코드의 문제점은 너무 불필요한 리랜더링이 많이 발생한다는 점이다.
최악의 경우 한번의 상태변경에 의해서 4번의 리랜더링이 발생할 수 있다.
( card => render -> goldCardcount 업데이트 -> render -> round 업데이트 -> render -> isGameOver 업데이트 -> render)

이러한 경우 굳이 useEffect 보다는 유저의 동작에 따라 상태를 업데이트하는 로직 내부에서 처리하는 것이 더 효율적일 수 있다.

```jsx
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error("Game already ended.");
    }

    // 함수 내부에서 조건부 처리
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert("Good game!");
        }
      }
    }
  }
}
```

> 하지만 useEffect 체이닝으로 로직을 구현하는게 더 적합한 경우가 있을 수 있다.  
> ex) 다수의 드롭다운이 연계되어 첫번째 드롭다운의 선택에 따라 다음 드롭다운의 리스트가 정해질 때  
> 요청을 통해 데이터를 동기화 시켜야함.

### 8. 어플리케이션 초기화

컴포넌트 최상단에서 어플리케이션이 로드되기 전에 딱 한번 실행시켜야하는 로직

```jsx
function App() {
  useEffect(() => {
    init();
    checkAuth();
  }, []);
}
```

만약 dev 개발 환경일 경우 두번 실행될 수 있다.  
프로덕션 레벨에서는 한번만 실행되기 때문에 문제가 없을 수 있지만 안정적으로 초기화 시키기 위해  
최상단에 변수를 추가해서 무조건 한번만 실행될 수 있도록 설정하거나, 아예 앱 랜더링 이전에 초기화하는 로직을 넣을 수 있다.

```jsx
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;

      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

```jsx
// 브라우저가 돌아가기 시작하고 앱이 로드되기 전 초기화 시키기
if (typeof window !== "undefined") {
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

### 9. 부모 컴포넌트에 상태변경 알림

### 10. 부모 컴포넌트에 데이터 전달

### 11. 외부 데이터 구독

### 12. 데이터 fetching

    ```jsx
    function SearchResults({ query }) {
      const [result, setResult] = useState([]);
      const [page, setPage] = useState(1);

      useEffect(() => {
        fetchResult(query, page).then((json) => {
          setResult(json);
        });
      }, [query, page]);

      function handleNextPageClick() {
        setPage(page + 1);
      }
    }
    ```

부모 컴포넌트로 부터 전달 받은 쿼리가 변화함에 따라 요청을 보내게되는데, 만약 query가 유저 입력에 따른 결과값이라면  
별도의 스로틀링 작업이 없는 빠른 속도로 입력되는 값 각각 모두 요청을 보내게 된다.  
ex) 'h', 'he', 'hel', 'hell', 'hello' -> 모두 요청을 보냄

[발생할 수 있는 문제점]

- 불필요한 다수의 요청이 발생될 수 있다.
- 응답값을 보장할 수 없는 race condition 발생

> ### race condition : 경쟁 상태
>
> 2개의 다른 요청이 예상과 다르게 다른 순서로 응답이 올 수 있는 상태  
> request1, request2 -> 이 순서로 요청을 보냈다고 해서 respone1, response2 응답도 같은 순서로 온다는 보장을 할 수 없음.

이를 해결하기 위해서는 tag를 사용하여 순서를 보장해주는 방법이 있다.

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    // ignore tag 변수로 마지막 요청을 제외하고는 모두 무시
    let ignore = false;
    fetchResults(query, page).then((json) => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```
