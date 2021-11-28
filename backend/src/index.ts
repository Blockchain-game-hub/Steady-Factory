import * as dotenv from "dotenv";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import cors from "cors";
import express from "express";
// import helmet from "helmet";

import path from "path";
import Database from "better-sqlite3";
import { parseBalanceMap } from "./parse-balance-map";
// import { ethers } from "hardhat";
// import MerkleDistributor from "../../artifacts/contracts/MerkleDistributor.sol/MerkleDistributor.json";
// import Moralis from "moralis/node";
dotenv.config();

// const serverUrl = process.env.MORALIS_SERVER;
// const appId = process.env.MORALIS_APPID;
// const moralisSecret = process.env.MORALIS_SECRET;
// Moralis.start({ serverUrl, appId, moralisSecret});
// const web3 = new Moralis.Web3();
//console.log("process.env.RINKEBY_KEY", process.env.RINKEBY_KEY);

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RINKEBY_RPC || "http://127.0.0.1:8545/"));
// const wssWeb3 = new Web3(
//   // new Web3.providers.WebsocketProvider("http://127.0.0.1:8545/" || "")
//   new Web3.providers.WebsocketProvider(process.env.RINKEBY_HTTP || "")
// );
dotenv.config();

const app = express();
const PORT = 80;
// app.use(helmet());
app.use(express.json());

/**
 * INTERFACES
 */
interface IScore {
  address: string;
  score: number;
}

/**
 * CONSTANTS & Globals
 */
const EPOCH_START = 9593770;
let currentEpoch = 0;

const createTable =
  "CREATE TABLE IF NOT EXISTS scores('epoch' number, 'score' number, 'address' varchar, 'epoch_index' number, 'claims' varchar);";
const createTable2 = 
  "CREATE TABLE IF NOT EXISTS hashes('epoch' number, 'merklehash' varchar);";

const db = new Database("steady.db", { verbose: console.log });
db.exec(createTable);
db.exec(createTable2);

app.use("/public", express.static(path.join(__dirname, "game")));
// app.get("/", function(req:any, res:any)  {
//   res.sendFile(path.join(__dirname, "./game/index.html"));
// });

/**
 * Store the scoreboard for a particular user into the current epoch
 */
app.post("/public/user/scoreboard", async (req: any, res: any) => {
  console.log(req.body);
  const data: IScore = req.body as IScore;
  res.send("Request Received");
  console.log()
  if (web3.utils.isAddress(data.address) && data.score > 0) {
    await saveToDB(
      parseInt(web3.utils.toWei(data.score.toString())),
      data.address
    );
  }
});

/**
 * For a particular user get the score board
 */
app.get(
  "/public/user/claim",
  (cors as (options: cors.CorsOptions) => express.RequestHandler)({
    maxAge: 84600,
  }),
  async (req: any, res: any) => {
    const user = req.query?.userAddress;
    if (user) {
      // retrieve from the DB the latest claims for this user and sent it
      const claims = await getMyLatestClaim(user);
      res.send(JSON.stringify(claims));
    } else {
      res.send("No user found");
    }
  }
);

/**
 * Get scoreboard for all users
 */
app.get("/public/history", (req: any, res: any) => {
  res.send("Got a request");
});

app.get("/public/merkleroot", async (req: any, res: any) => {
  const epoch = req.query?.epoch;
  console.log(epoch)
  if (epoch) {
    const stmt = db.prepare("SELECT epoch, merklehash FROM hashes WHERE epoch = ?");
    const query = await stmt.all(epoch);
    console.log(epoch)
    if(query) {
      res.send(JSON.stringify(query[0].merklehash));
    }
  } else {
    res.send("No user found");
  }
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: The Server is running at http://localhost:${PORT}`);
});

async function saveToDB(score: number, address: string) {
  const epoch = await calculateEpoch();
  const updateStmt = db.prepare(
    "UPDATE scores SET score=? where epoch=? and address = ?"
  );
  const info = updateStmt.run(score, epoch, address);
  if (info.changes === 0) {
    const stmt = db.prepare(
      "INSERT INTO scores (epoch, score, address) VALUES (?, ?, ?)"
    );
    stmt.run(epoch, score, address);
  }
}

async function calculateEpoch() {
  const currentBlock = await web3.eth.getBlockNumber();
  const numBlocks = parseInt(process.env.BLOCK || "30");
  const currentEpoch = Math.round((currentBlock - EPOCH_START) / numBlocks);
  console.log("currentEpoch--", currentEpoch);
  return currentEpoch;
}

async function getAllScores(_epoch: number) {
  const stmt = db.prepare("SELECT score, address FROM scores WHERE epoch = ?");
  const scores = await stmt.all(_epoch);
  console.log(scores);
  return scores;
}
// TODO: We need to store the claimed already information here so that the latest unclaimed can be sent
async function getMyLatestClaim(address: string) {
  const stmt = db.prepare(
    "SELECT address, score, claims, epoch_index, epoch FROM scores WHERE address = ? ORDER BY epoch DESC LIMIT 1"
  );
  const claims = await stmt.all(address.toLowerCase());
  console.log("claims", claims);
  // Here if claims is a single data then return array
  if (
    !Array.isArray(claims[0].claims) &&
    claims[0].claims.split(",").length === 1
  ) {
    const newClaims = [];
    newClaims.push(claims[0].claims);
    claims[0].claims = newClaims;
    console.log("Modified Claims -- ", claims);
  } else {
    claims[0].claims = claims[0].claims.split(",");
  }

  return claims;
}

// the merkle root has to be created for an epoch that is complete eg. T-1
async function generateMerkleRoot() {
  const jsonData: any = {};

  const latestEpoch = await calculateEpoch();

  const msg =
    "Attempting merkleroot generation current epoch && Latest epoch -";
  console.log(msg, currentEpoch, latestEpoch);

  if (latestEpoch > currentEpoch) {
    const scores = await getAllScores(currentEpoch);
    if (scores.length > 0) {
      try {
        // eslint-disable-next-line array-callback-return
        scores.map((obj) => {
          jsonData[obj.address] = obj.score;
        });
        console.log("Scores Obj --", jsonData);
        const merkleRootData = parseBalanceMap(jsonData);
        console.log(JSON.stringify(merkleRootData));

        const updateStmt = db.prepare(
          "UPDATE scores SET claims = ?, epoch_index = ? where epoch = ? and address = ?"
        );

        for (const [key, value] of Object.entries(merkleRootData.claims)) {
          console.log(`${key}: ${value.proof}`);
          const info = updateStmt.run(
            value.proof.toString(),
            value.index,
            currentEpoch,
            key.toLowerCase()
          );
          if (info.changes === 0) {
            console.error(
              "FAILED TO UPDATE MERKLE DATA",
              key,
              merkleRootData.claims
            );
          }
        }

        const stmt = db.prepare(
          "INSERT INTO hashes (epoch, merklehash) VALUES (?, ?)"
        );

        stmt.run(currentEpoch, merkleRootData.merkleRoot); 
        
        currentEpoch = latestEpoch;
      } catch (error) {
        console.error(error);
      }
    } else {
      // no scores
      currentEpoch = latestEpoch;
    }
  }
}

async function init() {
  currentEpoch = await calculateEpoch();
  // await saveToDB(22, "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
  // await testUpdate()
  // await getMyLatestClaim("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")
  setInterval(() => generateMerkleRoot(), 60 * 1000); // Every 5 minutes check if epoch is over
  // calculateEpoch();
  // getAllScores();
}

init();
