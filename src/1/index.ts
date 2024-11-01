import myWc from "./mywc";

const main = async () => {
  let res = await myWc(process.argv, process.stdin);
  console.log(res);
  process.exit();
};

main();
