import { useState } from 'react';

type Operation = Oper | Nothing;
class Oper {
  inner: string;
  constructor(inner: string) {
    if (inner.length == 1) {
      this.inner = inner;
    }
    else {
      throw new Error("length of inner should be 1");
    }
  }
  into(): string {
    return this.inner;
  }
  is_some(): this is Oper{
    return true;
  }
}
class Nothing {
  into(): string {
    return ".";
  }
  is_some(): this is Oper{
    return false;
  }
}

class Code {
  row_cnt: number;
  col_cnt: number;

  code: Operation[][];

  constructor(row_cnt: number, col_cnt: number, code: Operation[][] | undefined = undefined) {
    this.row_cnt = row_cnt;
    this.col_cnt = col_cnt;
    if (code === undefined) {
      this.code = [...Array(row_cnt)].map<Operation[]>((_x, _i): Operation[] => {
        return [...Array(row_cnt)].map<Operation>((_y, _j): Operation => new Nothing)
      });
    }
    else {
      this.code = code;
    }
  }

  get(cursor: Cursor): Operation {
    const row_idx = cursor.row_idx;
    const col_idx = cursor.col_idx;

    if (row_idx >= 0 && row_idx < this.row_cnt && col_idx >= 0 && col_idx < this.col_cnt) {
      return this.code[row_idx][col_idx];
    }
    else {
      throw new Error("index out of range");
    }
  }
  set(cursor: Cursor, value: Operation) {
    const row_idx = cursor.row_idx;
    const col_idx = cursor.col_idx;

    if (row_idx >= 0 && row_idx < this.row_cnt && col_idx >= 0 && col_idx < this.col_cnt) {
      this.code[row_idx][col_idx] = value;
    }
    else {
      throw new Error("index out of range");
    }
  }
}

class Cursor {
  row_cnt: number;
  col_cnt: number;

  row_idx: number;
  col_idx: number;

  constructor(row_cnt: number, col_cnt: number, row_idx: number, col_idx: number) {
    if (row_cnt < 0 || col_cnt < 0 || row_idx < 0 || col_idx < 0 || row_idx >= row_cnt || col_idx >= col_cnt) {
      throw new Error("index out of range");
    }
    this.row_cnt = row_cnt;
    this.col_cnt = col_cnt;
    this.row_idx = row_idx;
    this.col_idx = col_idx;
  }

  next(): Cursor {
    let next_row_idx: number = this.row_idx;
    let next_col_idx: number = this.col_idx + 1;
    if (next_col_idx >= this.col_cnt) {
      next_row_idx += 1;
      next_col_idx = 0;
    }
    if (next_row_idx >= this.row_cnt) {
      next_row_idx = 0;
      // throw new Error("not implemented: end of program");
    }

    return new Cursor(this.row_cnt, this.col_cnt, next_row_idx, next_col_idx);
  }

  prev(): Cursor {
    let next_row_idx: number = this.row_idx;
    let next_col_idx: number = this.col_idx - 1;
    if (next_col_idx < 0) {
      next_row_idx -= 1;
      next_col_idx = this.col_cnt - 1;
    }
    if (next_row_idx < 0) {
      next_row_idx = this.row_cnt - 1;
      // throw new Error("not implemented: end of program");
    }
    return new Cursor(this.row_cnt, this.col_cnt, next_row_idx, next_col_idx);
  }
}

export default function Mainscreen() {

  function AheuiProgram() {
    const [code, set_code] = useState(new Code(10, 10));
    const [cursor, set_cursor] = useState(new Cursor(10, 10, 0, 0));

    const [current_input_idx, set_current_input_idx] = useState(0);

    function keydownHandler(event) {
      setTimeout(() => {
        if (event.key === "Backspace") {
          const new_code = new Code(code.row_cnt, code.col_cnt, code.code);
          if (!code.get(cursor).is_some()) {
            set_cursor(cursor.prev());
            
            set_current_input_idx(0);
            event.target.value = "";
          }

          new_code.set(cursor, new Nothing);
          set_code(new_code);

        }
        else {
          let new_oper: string = event.target.value;
          new_oper = new_oper.slice(current_input_idx);

          const new_code = new Code(code.row_cnt, code.col_cnt, code.code);
          let next_cursor = cursor;
          let new_current_input_idx = current_input_idx;

          while (new_oper.length > 1) {
            console.log(`length>1 : ${new_oper}`);
            next_cursor = next_cursor.next();
            new_code.set(next_cursor, new Oper(new_oper[0]));

            new_oper = new_oper.slice(1);
            new_current_input_idx += 1;
          }

          if (new_oper.length === 1) {
            console.log(new_oper);
            new_code.set(next_cursor, new Oper(new_oper));
          }
          else if (new_oper.length === 0) {
            new_code.set(next_cursor, new Nothing);
          }

          set_code(new_code);
          set_cursor(next_cursor);
          set_current_input_idx(new_current_input_idx);
        }
      }
        , 0);

    }

    return <div className="aheui-program">
      {[...Array(code.row_cnt)].map((_, i) =>
        <Row key={i} code={code} cursor={cursor} row_idx={i} />
      )}
      <input type="text" className="input"
      autoFocus
        onKeyDown={keydownHandler}></input>
    </div>
  }

  function Row(data: { code: Code, cursor: Cursor, row_idx: number }) {
    return <div className="row">
      {[...Array(data.code.col_cnt)].map((_, i) =>
        <Cell key={i} code={data.code} cursor={data.cursor} row_idx={data.row_idx} col_idx={i} />
      )}
    </div>
  }

  function Cell(data: { code: Code, cursor: Cursor, row_idx: number, col_idx: number }) {
    function cellClickHandler(){
      // TODO : select the desired input
      document.querySelector("input").focus();

      // do we have to pass setCursor? idk gg
    }
    
    const str = data.code.get(
      new Cursor(data.code.row_cnt, data.code.col_cnt, data.row_idx, data.col_idx)
    ).into();
    if (data.row_idx === data.cursor.row_idx && data.col_idx === data.cursor.col_idx) {
      return <span className="cell cell-cursor" onClick={cellClickHandler}>{str}</span>

    }
    else {
      return <span className="cell" onClick={cellClickHandler}>{str}</span>
    }
  }

  return <>
    <h1>톡희</h1>
    <div>ㅎㅇ</div>
    <AheuiProgram></AheuiProgram>
  </>
}

