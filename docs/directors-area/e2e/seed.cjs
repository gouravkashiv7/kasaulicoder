// Seeds clearly marked E2E staff into the .env database; prints nothing secret.
const fs = require("node:fs");
const crypto = require("node:crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const dir = process.argv[2];
const password = crypto.randomBytes(12).toString("base64url");
const people = [
  ["E2E Director A", "e2e-a@e2e.kasaulicoder.test", true],
  ["E2E Director B", "e2e-b@e2e.kasaulicoder.test", true],
  ["E2E Director C", "e2e-c@e2e.kasaulicoder.test", true],
  ["E2E Plain Admin", "e2e-x@e2e.kasaulicoder.test", false],
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const staff = mongoose.connection.collection("staffs");
  const hash = await bcrypt.hash(password, 10);
  for (const [name, email, isDirector] of people) {
    await staff.updateOne(
      { email },
      {
        $set: {
          name,
          email,
          password: hash,
          role: "admin",
          designation: "E2E-TEST",
          isActive: true,
          isDirector,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );
  }
  const realDirectors = await staff.countDocuments({
    isDirector: true,
    designation: { $ne: "E2E-TEST" },
  });
  fs.writeFileSync(`${dir}/e2e-password.txt`, password);
  console.log(
    "seeded",
    people.length,
    "E2E staff; real directors already flagged:",
    realDirectors,
  );
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
