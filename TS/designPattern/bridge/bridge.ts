// bridge pattern
/**
 * Bridge pattern은 기능의 계층과 구현의 계층을 분리하여 각각을 독립적으로 확장할 수 있도록 하는 패턴
 * 새로운 기능을 추가할 때는 기능 계층을 확장하고
 * 새로운 구현을 추가할 때는 구현 계층을 확장하면서서 복잡도를 줄이고 확장성을 높이는 패턴
 *
 * 기능계층과 구현 계층은 서로 위임을 통해서 연결되어 있음
 *
 * 클래스들간의 관계는 단순하게 만들어주는것이 좋음. bridge pattern은 이러한 관계를 만들어주는 패턴
 */

/**
 * Draft
 * 어떤 글에대한 제목, 저자, 내용에 대한 것을 담고 있는 클래스
 * 그리고 그내용을 표시해주는 메소드를 가지고 있음
 * 표시해주는 방법은 Display라는 인터페이스를 통해 구현
 */

// 기능 계층
class Draft {
  constructor(
    private title: string,
    private author: string,
    private content: string
  ) {}

  getTitle() {
    return this.title;
  }

  getAuthor() {
    return this.author;
  }

  getContent() {
    return this.content;
  }

  print(display: Display): void {
    display.title(this);
    display.author(this);
    display.content(this);
  }
}

class CharactersCounter extends Draft {
  constructor(title: string, author: string, content: string) {
    super(title, author, content);
  }

  getCharactersCount(): number {
    let count = 0;

    count += this.getTitle().length;
    count += this.getAuthor().length;
    count += this.getContent().length;

    return count;
  }
}

// display 구현 계층
interface Display {
  title(draft: Draft): void;
  author(draft: Draft): void;
  content(draft: Draft): void;
}

class SimpleDisplay implements Display {
  title(draft: Draft): void {
    console.log(draft.getTitle());
  }
  author(draft: Draft): void {
    console.log(draft.getAuthor());
  }
  content(draft: Draft): void {
    console.log(draft.getContent());
  }
}

class CaptionDisplay implements Display {
  title(draft: Draft): void {
    console.log("제목 : ", draft.getTitle());
  }
  author(draft: Draft): void {
    console.log("저자 : ", draft.getAuthor());
  }
  content(draft: Draft): void {
    console.log("내용 : ", draft.getContent());
  }
}

const title = "아름다운 지구";
const author = "홍길동";
const content = "지구는 아름다운 곳이다.";

const draft = new CharactersCounter(title, author, content);

// const display = new SimpleDisplay();
const captionDispaly = new CaptionDisplay();

draft.print(captionDispaly);
console.log(draft.getCharactersCount());
