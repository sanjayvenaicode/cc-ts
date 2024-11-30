import { INode } from "./huffman";

export const unpack = (binaryContent: Uint8Array, padding: number) => {
  let binaryString = "";
  for (let i = 0; i < binaryContent.length; i++) {
    let byte = binaryContent[i];
    binaryString += byte.toString(2).padStart(8, "0");
  }
  return binaryString.slice(0, binaryString.length - padding);
};

export const bitStringToContent = (bitString: string, root: INode) => {
  let str = "";
  let currNode = root;
  for (let c of bitString) {
    currNode = c === "0" ? currNode.left! : currNode.right!;
    if (currNode.char) {
      str += currNode.char;
      currNode = root;
    }
  }
  console.log(str);
};
