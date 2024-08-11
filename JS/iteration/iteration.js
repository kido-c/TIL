const numberToIterate = 5;

numberToIterate[Pr][Symbol.iterator]() = function () {
  var nextIndex = start;
  var n = 0;

  var rangeIterator = {
    next: function () {
      var result;
      if (nextIndex < end) {
        result = { value: nextIndex, done: false };
      } else if (nextIndex == end) {
        result = { value: n, done: true };
      } else {
        result = { done: true };
        nextIndex += step;
        n++;
        return result;
      }
      return rangeIterator;
    },
  };
};

console.dir(numberToIterate);

for (let i of numberToIterate) {
  console.log(i);
}

const iterable = {
  [Symbol.iterator]() {
    return {
      i: 0,
      next() {
        if (this.i < 3) {
          return { value: this.i++, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  },
};

for (var value of iterable) {
  console.log(value); // 0 1 2
// }
Array.prototype.foo = "hello";
const forInArr = [1, 2, 3, 4, 5, 6, 7];

for (let i in forInArr) {
  console.log(forInArr[i]);
}
