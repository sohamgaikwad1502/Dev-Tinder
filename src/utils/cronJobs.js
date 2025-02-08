const cron = require("node-cron");
const { ConnectionRequest } = require("../models/Connections");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const { run } = require("./sendEmail");

cron.schedule("00 09 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequest.find({
      connectionStatus: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromConnectionId toConnectionId");

    console.log(pendingRequests);
    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toConnectionId.emailId)),
    ];

    for (const email of listOfEmails) {
      try {
        const res = await run(
          "New Friend Request Pending from :" + email,
          "Login to Dev tinder to accept or reject the requests"
        );
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
    console.log(listOfEmails);
  } catch (error) {
    console.log(error);
  }
});
