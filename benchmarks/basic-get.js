import autocannon from "autocannon";
import dotEnv from "dotenv";

dotEnv.config();

function startBench() {
  const url = "http://localhost:2001";

  const args = process.argv.slice(2);
  const num = args[0] || 1000;
  const maxConnectionRequests = args[1] || 1000;

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
          method: "GET",
          path: "/",
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