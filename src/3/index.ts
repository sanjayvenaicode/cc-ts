import fs from "fs";
import path from "path";
import Huffman from "./huffman";

let [action, fileName, output, ...args] = process.argv.slice(2);

// if (!fileName || !action) {
//   console.log(`Provide correct file name and action`);
//   process.exit(1);
// }

// action
action = `--compress`;
// action = `--decompress`;
// action

if (action === `--compress`) {
  // compress test file
  fileName = `traces-2024-11-01T07-56-11.118.txt`;
  output = `delete.txt`;
  // compress test file
} else {
  // decompress test file
  fileName = `delete.txt`;
  output = "decompressed_delete.txt";
  // decompress test file
}

const filePath = path.join(__dirname, fileName);
const outputPath = path.join(__dirname, output);

const main = async () => {
  let content = fs.readFileSync(filePath, "utf-8");
  let compressedContent = new Huffman();

  if (action === `--compress`) {
    //   test input files
    compressedContent.compress(content, outputPath);
    const inputFileStat = fs.statSync(filePath);
    const outputFileStat = fs.statSync(outputPath);
    console.log(`Input file size : ${inputFileStat.size}`);
    console.log(`Output file size : ${outputFileStat.size}`);
    console.log(
      `Compression ratio achieved : ${
        (1 - outputFileStat.size / inputFileStat.size) * 100
      }`
    );
    process.exit(0);
    //   test
  } else {
    compressedContent.decompress(filePath, outputPath);
  }
};

main();
