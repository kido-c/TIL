aVariable = "Outer";

function aFun() {
  var aVariable = "Middle";

  return [1, 2, 3].map(function (e) {
    var aVariable = "Inner";
    return [aVariable, e].join(" ");
  });
}

console.log(aFun());

/**
 * aVariable 은 가장 내부의 변수값 Inner이 다른값보다 우선권을 가짐.
 *
 */

let outer = "Outer";

function closure() {
  let outer = "Middle";

  return function inner() {
    let inner = "Inner";
    console.log(outer, inner);
  };
}

let innerFun = closure();
console.dir(innerFun());

const obj = {
  key1: "value1",
  key2: "value2",
};

const arr = [2, 1, 3, 4, 5];

for (key in arr) {
  console.log(arr[key]);
}
