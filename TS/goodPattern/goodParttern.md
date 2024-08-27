1. Props children 보다는 PropWithChildren

```ts
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Component({ children }): Props {
  return <div>{children}</div>;
}

// to be
import { PropsWithChildren } from "react";

export default function Component({ children }): PropsWithChildren {
  return <div>{children}</div>;
}
```

2. Spreading props

```ts
<Buttons>
  <button type="button" outline onClick={goBack}>
    Cancel
  </button>
  <button icon={FaPaperPlane}> Save</button>
</Buttons>;

// Button.tsx

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: FC;
  outline?: boolean;
}

// to be

type BaseButton = JSX.IntrinsicElements["button"];

interface ButtonProps extends BaseButton {
  icon?: FC;
  outline?: boolean;
}

// 직접 확장할 수 없는 단점 발생
// 첫번째와 두번째 모두 ref 프로퍼티를 내장하고 있음

// Final

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  icon?: FC;
  outline?: boolean;
}

export default function Button({
  icon: Icon,
  outline = false,
  children,
}: ButtonProps) {}
```

3. 생략 및 필수로 만들기

```ts
interface NumberInputProps
  extends Omit<ComponentPropsWithoutRef<"input">, "type" | "pattern"> {
  unit?: string;
  value: number;
}

interface FormProps extends ComponentPropsWithoutRef<"form"> {
  onSubmit: ComponentPropsWithoutRef<"form">["onSubmit"];
  title: string;
}
```

4. 둘 중 하나만 가능한 인터페이스

```ts
interface LinkAction {
  label: string;
  link: (id: string) => string;
}

interface ClickAction {
  label: string;
  onClick: (item: TableRecord) => void;
}

type Action = LinkAction | ClickAction;

interface TableRecord extends Record<string, ReactNode> {
  id: string;
}

interface TableProps<T extends TableRecord> {
  rows: T[];
  headers: Record<keyof Omit<T, "id">, string>;
  actions?: Action[];
}

// example2

interface OnSelect<T> {
  name: string;
  value: T;
}

interface BaseProps
  extends Omit<ComponentPropsWithoutRef<"select">, "onSelect"> {
  options: string[];
}

interface SingularSelectProps extends BaseProps {
  multiple?: false;
  value: string;
  onSelect: ({ name, value }: OnSelect<string>) => void;
}

interface PluralSelectProps extends BaseProps {
  multiple: true;
  value: string[];
  onSelect: ({ name, value }: OnSelect<string[]>) => void;
}

type SelectProps = SingularSelectProps | PluralSelectProps;

function Input(props: SelectProps) {}
```

5. Generic Components
