import { readFileSync } from "node:fs";
import { calculateCommissions } from "./calculations";

const main = async () => {
  console.log("Please specify the path of input file");
  process.stdin.on("data", async (input) => {
    const json = JSON.parse(readFileSync(input.toString().trim(), "utf-8"));
    const result = await calculateCommissions(json);
    console.log(result.join("\n"));
  });
};

main();
