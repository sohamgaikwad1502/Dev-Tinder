const cron = require("node-cron");
const { ConnectionRequest } = require("../models/Connections");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const { run } = require("./sendEmail");

cron.schedule("00 09 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = new Date(startOfDay(yesterday).toISOString());
    const yesterdayEnd = new Date(endOfDay(yesterday).toISOString());

    const pendingRequests = await ConnectionRequest.find({
      connectionStatus: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromConnectionId toConnectionId");

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toConnectionId.emailId)),
    ];

    for (const email of listOfEmails) {
      try {
        const res = await run(
          "New Friend Request Pending from :" + email,
          "Login to Dev tinder to accept or reject the requests"
        );
      } catch (error) {
        console.log(error + "---error in sending mail");
      }
    }
  } catch (error) {
    console.log(error + "---error in cron schedule");
  }
});
