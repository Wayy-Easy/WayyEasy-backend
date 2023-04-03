import autocannon from "autocannon";
import dotEnv from "dotenv";
import { usersData } from "./users.js";

dotEnv.config();

function startBench() {
  const url = "http://localhost:2001";

  const args = process.argv.slice(2);
  const num = args[0] || 1000;
  const maxConnectionRequests = args[1] || 1000;

  let currentRequestNumber = 0;

  const instance = autocannon(
    {
      url,
      connections: num,
      duration: 10,
      maxConnectionRequests,
      headers: {
        "content-type": "application/json",
      },
      requests: [
        {
          method: "POST",
          path: "/api/physicians/login",
          setupRequest: function (req) {
            console.log("currentRequestNumber: " + currentRequestNumber);

            req.body = JSON.stringify(usersData[currentRequestNumber]);

            currentRequestNumber++;

            return req;
          },
        },
      ],
    },
    finishBench
  );

  autocannon.track(instance);

  function finishBench(err, res) {
    console.log(`Finish benchmark error: ${err}, res: ${res}`);
  }
}

startBench();
