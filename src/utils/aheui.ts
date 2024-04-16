import * as hangul from "hangeul-js";

export class AheuiInterpreter {
  instructions: string[][];
  x = 0;
  y = 0;
  movement = 1;
  direction = 2;

  constructor(text: string) {
    this.instructions = text.split("\n").map((s: string) => s.trim().split(""));
  }

  run(): Promise<void> {
    return new Promise<void>((resolve) => {
      const id = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          const result = this.tick();
          if (!result) {
            clearInterval(id);
            resolve();
          }
        }
      }, 100);
    });
  }

  tick(): boolean {
    const xLen = this.instructions[0].length;
    const yLen = this.instructions.length;

    const char = this.instructions[this.y][this.x];
    const jamo = hangul.disassemble(char);
    let start: string,
      mid: string,
      end: string = "";
    if (jamo.length == 2) {
      [start, mid] = jamo;
    } else {
      [start, mid, end] = jamo;
    }

    if (mid == "ㅏ") {
      this.movement = 1;
      this.direction = 1;
    } else if (mid == "ㅑ") {
      this.movement = 2;
      this.direction = 1;
    } else if (mid == "ㅓ") {
      this.movement = 1;
      this.direction = 3;
    } else if (mid == "ㅕ") {
      this.movement = 2;
      this.direction = 3;
    } else if (mid == "ㅗ") {
      this.movement = 1;
      this.direction = 0;
    } else if (mid == "ㅛ") {
      this.movement = 2;
      this.direction = 0;
    } else if (mid == "ㅜ") {
      this.movement = 1;
      this.direction = 2;
    } else if (mid == "ㅠ") {
      this.movement = 2;
      this.direction = 2;
    } else if (mid == "ㅡ") {
      if (this.direction == 0) {
        this.direction = 2;
      } else if (this.direction == 2) {
        this.direction = 0;
      }
    } else if (mid == "ㅣ") {
      if (this.direction == 1) {
        this.direction = 3;
      } else if (this.direction == 3) {
        this.direction = 1;
      }
    } else if (mid == "ㅢ") {
      if (this.direction == 0) {
        this.direction = 2;
      } else if (this.direction == 1) {
        this.direction = 3;
      } else if (this.direction == 2) {
        this.direction = 0;
      } else if (this.direction == 3) {
        this.direction = 1;
      }
    }

    this.speak(char);

    if (start == "ㅎ") {
      return false;
    }

    if (end) {
      1 + 1;
    }

    if (this.direction == 0) {
      if (this.y < this.movement) {
        this.y = yLen - 1;
      } else {
        this.y -= this.movement;
      }
    } else if (this.direction == 1) {
      if (this.x + this.movement >= xLen) {
        this.x = 0;
      } else {
        this.x += this.movement;
      }
    } else if (this.direction == 2) {
      if (this.y + this.movement >= yLen) {
        this.y = 0;
      } else {
        this.y += this.movement;
      }
    } else if (this.direction == 3) {
      if (this.x < this.movement) {
        this.x = xLen - 1;
      } else {
        this.x -= this.movement;
      }
    }

    return true;
  }

  speak(char: string) {
    const msg = new SpeechSynthesisUtterance(char);
    msg.lang = "ko-KR";
    msg.rate = 1;
    window.speechSynthesis.speak(msg);
  }
}
