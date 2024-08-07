## 의존성과 버전

### 버전(version)

유의적 버전 : 버전을 **주, 부, 수** 로 구성으로 버저닝을 하는 방식

- 주 : 기존 버전과 호환이 되지 않는 업데이트한 버전
- 부 : 기존 버전과 호환이 되고 새로운 기능을 업데이트한 버전
- 수 : 기존 버전과 호환이 되고 버그를 수정을 업데이트한 버전

ex) 기존 버전 : v14.0.0

- 주: v15.0.0 ( v14.0.0과 호환되지 않음)
- 부: v14.1.0 ( v14.0.0과 호환됨 )
- 수: v14.0.1 ( v14.0.0과 호환됨 )

```
[추가적으로 주의해야 할 사항]
- 주 버전이 0으로 시작하면 실험적인 라이브러리이므로 부의 버전이 올라가더라도 기존의 버전과 호환되지 않을 수 도 있다. 그래서 해당 라이브러리의 사용은 주의해야한다. (ex) Recoil v0.7.6)
```

### npm과 버전

npm에서는 버전에 대해서 규칙을 정해 놓았다.

- react@16.0.0 : 아무런 기호를 붙이지 않는 경우, 명시되어잇는 16.0.0버전에 대해서만 의존하고 있다.
- react@^16.0.0 : `^`기호를 붙이는 경우, 16.0.0버전과 호환이되는 모든 버전에 대해서 의존하고 있고 설치할 수 있다는 의미 ( 16.0.0 ~ 17.0.0 미만의 모든 버전 )
- react@~16.0.0 : `~`기호를 붙이는 경우, 패치 버전에 대해서만 호환되는 버전 ( 16.0.0 ~ 16.1.0 미만의 모든 버전 )

염두해두어야할 사항은 위와 같은 사항은 `암묵적인 약속`일 뿐 모든 개발자가 지켰다고 보장할 수는 없다. 그래서 라이브러리 사용에는 항상 주의가 필요하다.
