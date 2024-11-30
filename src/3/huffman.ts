import { PriorityQueue } from "@datastructures-js/priority-queue";
import fs from "fs";
import { bitStringToContent, unpack } from "./utils";

type FreqMap = Map<string, number>;
export type INode = {
  char: string | null;
  freq: number;
  left: INode | null;
  right: INode | null;
};

interface ICompare<T> {
  (a: T, b: T): number;
}

const compareNodes: ICompare<INode> = (a, b) => {
  if (a.freq < b.freq) return -1;
  else if (a.freq > b.freq) return 1;
  else return 0;
};

class Node implements INode {
  char: string | null;
  freq: number;
  left: INode | null;
  right: INode | null;

  constructor(
    char: string | null,
    freq: number,
    left: INode | null = null,
    right: INode | null = null
  ) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

class Huffman {
  createFrequencyTable(input: string) {
    let map: FreqMap = new Map();

    for (let c of input) {
      map.set(c, (map.get(c) ?? 0) + 1);
    }
    return map;
  }

  createHuffmanTree(map: FreqMap): INode {
    let freqMap = map;
    let priorityQueue = new PriorityQueue(compareNodes);

    for (const [char, freq] of freqMap) {
      let node = new Node(char, freq);
      priorityQueue.enqueue(node);
    }

    while (priorityQueue.size() > 1) {
      let left = priorityQueue.dequeue();
      let right = priorityQueue.dequeue();
      let newNode = new Node(null, left.freq + right.freq, left, right);
      priorityQueue.enqueue(newNode);
    }
    const node = priorityQueue.dequeue();
    return node;
  }

  traverseQueue(
    node: INode,
    map: Map<string, string>,
    str = ""
  ): Map<string, string> {
    let { char, left, right } = node;
    if (char) {
      map.set(char, str);
    }

    if (left) {
      this.traverseQueue(left, map, str + "0");
    }
    if (right) {
      this.traverseQueue(right, map, str + "1");
    }
    return map;
  }

  createCharBitMap(node: INode) {
    let map: Map<string, string> = new Map();
    map = this.traverseQueue(node, map);
    return map;
  }

  transformCharToBit(content: string, map: Map<string, string>): string {
    let bitContent = content
      .split("")
      .map((c) => map.get(c))
      .join("");

    return bitContent;
  }

  convertToBinary(binaryStr: string): [Uint8Array, number] {
    let str = binaryStr;

    while (str.length % 8 !== 0) {
      str += "0";
    }

    const byteSize = str.length / 8;
    const padding = str.length - binaryStr.length;
    let bytes = new Uint8Array(byteSize);

    for (let i = 0; i < byteSize; i++) {
      let start = i * 8;
      let end = start + 8;
      let slice = binaryStr.slice(start, end);
      let binarySlice = parseInt(slice, 2);
      bytes[i] = binarySlice;
    }

    return [bytes, padding];
  }

  convertCharBitMapToString(map: Map<string, number>) {
    return JSON.stringify(Array.from(map.entries()));
  }

  writeToFile(
    filePath: string,
    charBitMapString: string,
    bytes: Uint8Array,
    padding: number
  ) {
    let headerEncoded = new TextEncoder().encode(charBitMapString);

    fs.writeFileSync(filePath, headerEncoded.length.toString() + "\n");
    fs.appendFileSync(filePath, padding.toString() + "\n");
    fs.appendFileSync(filePath, charBitMapString);
    fs.appendFileSync(filePath, bytes);
  }

  compress(input: string, outputPath: string) {
    let freqMap = this.createFrequencyTable(input);
    let tree = this.createHuffmanTree(freqMap);
    let charBitMap = this.createCharBitMap(tree);
    let binaryStringContent = this.transformCharToBit(input, charBitMap);
    const [bytes, padding] = this.convertToBinary(binaryStringContent);
    let charBitMapString = this.convertCharBitMapToString(freqMap);
    this.writeToFile(outputPath, charBitMapString, bytes, padding);
  }

  processBuffer(content: Buffer): [Map<string, number>, Uint8Array, number] {
    let index = 0;

    while (content[index] !== "\n".charCodeAt(0)) {
      index++;
    }
    const charFreqLen = parseInt(content.subarray(0, index).toString());
    index++;

    const padding = parseInt(content.subarray(index, index + 1).toString());
    index = index + 2;

    const charFreqEnd = index + charFreqLen;
    const freqTable = new Map<string, number>(
      JSON.parse(content.subarray(index, charFreqEnd).toString())
    );
    const binaryContent = content.subarray(charFreqEnd);
    console.log(binaryContent);

    return [freqTable, binaryContent, padding];
  }

  decompress(inputPath: string, outputPath: string) {
    const contentBuffer = fs.readFileSync(inputPath);
    let [freqTable, binaryContent, padding] = this.processBuffer(contentBuffer);
    let huffManTree = this.createHuffmanTree(freqTable);
    // let charBinMapping = this.createCharBitMap(huffManTree);
    // console.log(huffManTree);
    let binaryString = unpack(binaryContent, padding);
    bitStringToContent(binaryString, huffManTree);
  }
}

export default Huffman;
