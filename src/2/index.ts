import fs from "fs";
import Pareser from "./parser";
import path from "path";

let [fileName, ...args] = process.argv.slice(2);

//
fileName = "valid.json";
// fileName = "invalid.json";
//
const testFilePath = path.join("tests", "step4", fileName);

const filePath = path.join(__dirname, testFilePath);

if (!fs.existsSync(filePath)) {
  console.log(`No file present with name ${fileName}`);
  process.exit(1);
}

const fileContent = fs.readFileSync(filePath, "utf-8");

const parser = new Pareser(fileContent);
console.log(parser.parse());
