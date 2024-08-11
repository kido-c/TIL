function log(msg) {
  document.getElementById("log").innerHTML += msg + "<br>";
}

wakeup = null;
// wakeup()을 호출하여 해결될 약속을 반환합니다.
// (이것은 목록일 수 있거나 무엇이든 될 수 있습니다. 이것은 단순한 데모입니다.)
function wakeable() {
  return new Promise((resolve, reject) => {
    log("(wakeable: 약속 생성 중, 해결 함수로 <tt>wakeup</tt> 설정)");
    wakeup = () => {
      log("wakeup: 깨어났습니다!");
      resolve(true);
      log("wakeup: 해결 후");
    };
  });
}
// 기다리고 깨우는 데모:
async function handle_event() {
  while (true) {
    log("기다리는 중…");
    await wakeable(); // 여기서 이벤트 루프로 돌아감
    log("handle_event: await가 성공적으로 반환되었습니다!");
  }
}

// handle_event(); // "백그라운드"에서 시작
// log("main: wakeup 호출 직전");
// wakeup(); // 깨우기
// setTimeout((_) => {
//   wakeup();
// }, 2000); // 지연 후 다시 깨우기
// log("소스 파일 끝에 도달");

const p = Promise.resolve();

console.log("Promise.resolve() result : ", p);

// (async () => {
//   await p;
//   console.log("after: awiat");
// })();

// p.then(() => console.log("tick:a")).then(() => console.log("tick:b"));
