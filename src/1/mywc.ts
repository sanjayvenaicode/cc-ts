import fs from "fs";
import path from "path";

const byteCount = (filePath: string) => {
  let stats = fs.statSync(filePath);
  return stats.size.toString();
};

const lineCount = (fileContent: string) => {
  return fileContent.trim().split(/\n/).length.toString();
};

const wordCount = (fileContent: string) => {
  return fileContent.trim().split(/\s+/).length.toString();
};

const charCount = (fileContent: string) => {
  return fileContent.length.toString();
};

const getInput = (): Promise<string> => {
  return new Promise((res, rej) => {
    process.stdin.once("data", (data) => {
      console.log("Enter file path :");
      res(data.toString().trim());
    });
  });
};

const myWc = async (
  argv: string[],
  stdin: NodeJS.ReadStream | fs.ReadStream
): Promise<string> => {
  let [fileName, flag, ...args] = argv.slice(2);

  stdin.setEncoding("utf8");

  let filePath: string;

  if (!fileName) {
    let fileName = await getInput();
    filePath = path.join(__dirname, fileName);
  } else filePath = path.join(__dirname, fileName);

  if (!filePath || !filePath.trim()) {
    console.error("input params wrong");
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error("file path wrong");
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");

  switch (flag) {
    // return no of bytes
    case "-c":
      return byteCount(filePath);
    case "-l":
      return lineCount(fileContent);
    case "-w":
      return wordCount(fileContent);
    case "-m":
      return charCount(fileContent);
    default:
      return `${byteCount(filePath)} ${lineCount(fileContent)} ${wordCount(
        fileContent
      )} ${filePath.split("/").at(-1)}`;
  }
};

export default myWc;
