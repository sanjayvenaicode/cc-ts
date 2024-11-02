import { Tokens } from "./tokens";
import { JSONArray, JSONValue } from "./types";

class Pareser {
  private pos = 0;
  private input: string;

  currentToken = () => this.input.charAt(this.pos);

  skipSpaces(char?: string) {
    if (char && this.currentToken() !== char) {
      throw new Error(`Expected ${char} but got ${this.currentToken()}`);
    } else if (char === this.currentToken()) {
      this.pos++;
    }
    while (/\s/.test(this.currentToken())) {
      this.pos++;
    }
  }

  parseString() {
    let str = "";
    this.skipSpaces(Tokens.QUOTES);
    while (this.currentToken() !== '"') {
      str += this.currentToken();
      this.pos++;
    }
    this.skipSpaces(Tokens.QUOTES);
    this.skipSpaces();
    return str;
  }

  parseObj() {
    let obj: JSONValue = {};
    let parse = true;
    this.skipSpaces(Tokens.OBJ_BEGIN);
    while (parse) {
      if (this.currentToken() === "}") {
        this.skipSpaces(Tokens.OBJ_END);
        return obj;
      }

      if (this.currentToken() === ",") {
        this.skipSpaces(Tokens.COMMA);
      }

      //   start of the key
      if (this.currentToken() !== '"') {
        throw new Error("Invalid Content");
      }

      let key = this.parseString();
      this.skipSpaces(Tokens.COLON);
      let value = this.parse();

      obj[key] = value;
    }

    return obj;
  }

  parseArr() {
    this.skipSpaces(Tokens.ARR_BEGIN);
    let arr: JSONArray = [];

    if (this.currentToken() === Tokens.ARR_END) {
      this.skipSpaces(Tokens.ARR_END);
      return arr;
    }
    while (1) {
      let entity = this.parse();
      arr.push(entity);

      if (this.currentToken() === Tokens.ARR_END) {
        this.skipSpaces(Tokens.ARR_END);
        return arr;
      }

      this.skipSpaces(Tokens.COMMA);
      if (this.currentToken() !== Tokens.COMMA) {
        throw new Error("Can parse array");
      }
    }

    this.skipSpaces(Tokens.ARR_END);
    return arr;
  }

  parseBoolean() {
    let res: boolean;
    if (this.currentToken() === "t") {
      this.pos += 4;
      res = true;
    } else {
      this.pos += 5;
      res = false;
    }

    this.skipSpaces();
    return res;
  }

  parseNull() {
    this.pos += 4;
    this.skipSpaces();
    return null;
  }

  parseNumber() {
    let res = "";
    let regex = /\d/;

    while (regex.test(this.currentToken())) {
      res += this.currentToken();
      this.pos++;
    }
    return Number(res);
  }

  constructor(input: string) {
    this.input = input;
  }

  parse() {
    this.skipSpaces();

    let currentChar = this.currentToken();

    if (!isNaN(Number(this.currentToken()))) {
      currentChar = "number";
    }

    try {
      switch (currentChar) {
        case Tokens.OBJ_BEGIN:
          return this.parseObj();
        case Tokens.ARR_BEGIN:
          return this.parseArr();
        case Tokens.QUOTES:
          return this.parseString();
        case Tokens.TRUE:
          return this.parseBoolean();
        case Tokens.FALSE:
          return this.parseBoolean();
        case Tokens.NULL:
          return this.parseNull();
        case Tokens.NUMBER:
          return this.parseNumber();
        default:
          throw new Error(`Not parsable content`);
      }
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
}

export default Pareser;
