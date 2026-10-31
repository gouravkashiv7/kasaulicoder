const mongoose = require("mongoose");
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection;
  const staff = await db
    .collection("staffs")
    .find({ designation: "E2E-TEST" })
    .project({ _id: 1 })
    .toArray();
  const ids = staff.map((s) => s._id);
  const by = {
    policies: "proposedBy",
    clients: "createdBy",
    payments: "recordedBy",
    expenses: "requestedBy",
    attachments: "uploadedBy",
    threads: "createdBy",
    threadmessages: "author",
  };
  const total = {};
  for (const name of Object.keys(by))
    total[name] = await db.collection(name).countDocuments({});
  console.log(
    "E2E staff:",
    ids.length,
    "| totals before:",
    JSON.stringify(total),
  );
  for (const [name, field] of Object.entries(by)) {
    const r = await db.collection(name).deleteMany({ [field]: { $in: ids } });
    console.log(`deleted ${r.deletedCount} from ${name}`);
  }
  const r = await db.collection("staffs").deleteMany({
    designation: "E2E-TEST",
    email: /@e2e\.kasaulicoder\.test$/,
  });
  console.log(`deleted ${r.deletedCount} E2E staff`);
  const left = {};
  for (const name of [...Object.keys(by), "staffs"])
    left[name] = await db
      .collection(name)
      .countDocuments(name === "staffs" ? { designation: "E2E-TEST" } : {});
  console.log("remaining:", JSON.stringify(left));
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
