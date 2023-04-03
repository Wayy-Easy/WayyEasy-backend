import autocannon from "autocannon";
import dotEnv from "dotenv";
import { bookingData } from "./booking.js";

dotEnv.config();

function startBench() {
  const url = "http://localhost:2001";

  const args = process.argv.slice(2);
  const num = args[0] || 1000;
  const maxConnectionRequests = args[1] || 1000;
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDE5ZWQxY2EzMmZkNjI3MzM3MjExMzQiLCJudW1iZXIiOiI5NzQ4OTc2OTIyIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2Nzk0MjA3MDB9.0c_CYq5zhfLIKVm7VaeCona7cHo2cEYrpn6hI7QuE_4";

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
          path: "/api/physicianBookedByUsers/addUsersUnderPhysician/6419e7bf8201634c0d75cae8",
          setupRequest: function (req) {
            req.headers.Authorization = `Bearer ${token}`;

            req.body = JSON.stringify(bookingData[0]);

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
