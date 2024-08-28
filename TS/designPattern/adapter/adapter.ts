// Adapter pattern
/**
 * Adapter pattern은 코드를 변경할 수 없는 클래스를 원하는 형태로 사용하고자 할 때 적용할 수 있는 패턴
 * 클래스를 변경하기 어려운 경우
 * - 처음부터 코드가 제공되지 않는 클래스의 경우
 * - 이미 많은 프로그램에서 사용되는 공용클래스로 영향받는 다른 프로그램의 코드가 너무 많은 경우
 * - 어떤 클래스가 버전업된 경우 하위버전의 클래스도 지원해야하는 경우
 */

abstract class Animal {
  constructor(protected name: string) {}

  abstract sound(): void;
}

class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }

  sound(): void {
    console.log("wang wang wang");
  }
}

class Cat extends Animal {
  constructor(name: string) {
    super(name);
  }

  sound(): void {
    console.log("miao miao miao");
  }
}

// tiger class
// Animal과 형태가 다른 클래스

class Tiger {
  private _name: string | null = null;

  set name(value: string) {
    this._name = value;
  }

  get name(): string | null {
    return this._name;
  }

  roar(): string {
    return "으르렁";
  }
}

class TigerAdapter extends Animal {
  private tiger: Tiger;

  constructor(name: string) {
    super(name);
    this.tiger = new Tiger();
    this.tiger.name = name;
  }
  sound(): void {
    console.log(this.tiger.roar());
  }
}

const list = Array<Animal>();

list.push(new Dog("강아지"));
list.push(new Cat("고양이"));
list.push(new TigerAdapter("호랑이"));

list.forEach((animal) => animal.sound());
