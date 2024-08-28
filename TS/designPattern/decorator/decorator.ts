// Run: ts-node TS/designPattern/decorator/decorator.ts
/**
 * Decorator Pattern은 어떤 객체에 기능(장식)을 적용할 때 그 객체와 적용될 기능을 동일시 할수 있음
 * 데이터와 기능을 동일시 할 수 있으므로 다양한 기능을 중첩해서 적용할 수 있으며 적용되는 기능의 순서에 따라 다른 결과를 얻을 수 있음
 * +-----------------------+
 * |0000| Decorator Pattern|
 * |0001| my name is       |
 * |0002| james            |
 * |0003| hello world      |
 * +-----------------------+
 */
abstract class Item {
  abstract getLinesCount(): number;
  abstract getLength(i: number): number;
  abstract getMaxLength(): number;
  abstract getString(i: number): string;

  print() {
    const reault: string[] = [];
    const cntLines = this.getLinesCount();

    for (let i = 0; i < cntLines; i++) {
      const string = this.getString(i);
      reault.push(string);
    }
    return reault.join("\n");
  }
}

class Strings extends Item {
  private data = new Array<string>();
  constructor() {
    super();
  }
  ㄹㅍ;

  add(str: string) {
    this.data.push(str);
  }

  getLinesCount(): number {
    return this.data.length;
  }

  getLength(i: number): number {
    return this.data[i].length;
  }

  getMaxLength(): number {
    return this.data.reduce((acc, cur) => Math.max(acc, cur.length), 0);
  }

  getString(i: number): string {
    return this.data[i];
  }
}

abstract class Decorator extends Item {
  constructor(protected item: Item) {
    super();
  }
}

class SideDecorator extends Decorator {
  // ch: 문자열 양옆에 추가할 문자
  constructor(item: Item, private ch: string) {
    super(item);
  }
  getLinesCount(): number {
    return this.item.getLinesCount();
  }

  getLength(i: number): number {
    return this.item.getLength(i) + this.ch.length * 2;
  }
  getMaxLength(): number {
    return this.item.getMaxLength() + this.ch.length * 2;
  }
  getString(i: number): string {
    return this.ch + this.item.getString(i) + this.ch;
  }
}

class BoxDecorator extends Decorator {
  constructor(item: Item) {
    super(item);
  }
  getLinesCount(): number {
    // 원래 문자열에 대해서 위아래 구분선 추가
    return this.item.getLinesCount() + 2;
  }

  getLength(i: number): number {
    // 원래 문자열의 길이에 대해서 양옆에 구분선 추가
    return this.item.getLength(i) + 2;
  }
  getMaxLength(): number {
    // 원래 문자열의 최대 길이에 대해서 양옆에 구분선 추가
    return this.item.getMaxLength() + 2;
  }

  getString(i: number): string {
    const maxLength = this.getMaxLength();
    // 첫번째 줄과 마지막 줄은 구분선
    if (i === 0 || i === this.getLinesCount() - 1) {
      return "+" + "-".repeat(maxLength - 2) + "+";
    } else {
      // 나머지는 원래 문자열에 대해서 양옆에 구분선 추가
      return (
        "|" +
        this.item.getString(i - 1) +
        " ".repeat(maxLength - this.getLength(i - 1)) +
        "|"
      );
    }
  }
}

class LineNumberDecorator extends Decorator {
  constructor(item: Item) {
    super(item);
  }
  getLinesCount(): number {
    return this.item.getLinesCount();
  }

  getLength(i: number): number {
    return this.item.getLength(i) + 6;
  }
  getMaxLength(): number {
    return this.item.getMaxLength() + 6;
  }

  getString(i: number): string {
    return `${i}`.padStart(4, "0") + `| ${this.item.getString(i)}`;
  }
}

const strs = new Strings();

strs.add("Decorator Pattern");
strs.add("my name is");
strs.add("james");
strs.add("hello world");

console.log(strs.print());

const side = new SideDecorator(strs, "*");
const line = new LineNumberDecorator(strs);
const box = new BoxDecorator(line);

console.log(side.print());
console.log(box.print());
console.log(line.print());
