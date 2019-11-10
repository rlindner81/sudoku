import path from "path";
import { promises as fs } from "fs";
import PRNG from "./../src/util/PRNG.mjs";

(async () => {
  const data = (await fs.readFile("17puz49157.txt")).toString();
  const lines = data.split("\r\n");
  const prng = new PRNG("42");
  prng.shuffle(lines);
  for (const line of lines.slice(0, 20)) {
    console.log(line)
  }
})();
