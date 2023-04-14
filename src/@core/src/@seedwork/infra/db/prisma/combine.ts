const fs = require("fs");
const path = require("path");

const mainPath = path.join(__dirname, "./", "main.prisma");

const userPath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "user",
  "infra",
  "db",
  "prisma",
  "user.prisma"
);

const combinePath = path.join(__dirname, "./", "schema.prisma");

const user = fs.readFileSync(userPath, "utf-8");
const main = fs.readFileSync(mainPath, "utf-8");

fs.writeFileSync(`${combinePath}`, `${main}\n${user}`);
