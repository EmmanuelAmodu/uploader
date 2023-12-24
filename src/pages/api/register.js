import database from "../../lib/mongodb";
import bcrypt from "bcryptjs";

async function handler(req, res) {
  if (req.method === "POST") {
    const { username, email, password } = req.body;

    if (!isValidEmail(email) && !isValidPassword(password)) {
      res.status(422).json({ message: "Invalid input" });
      return;
    }

    const db = await database;
    const existingUser = await db.collection("users").findOne({ email: email });
    if (existingUser) {
      res.status(422).json({ message: "User already exists!" });
      client.close();
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await db.collection("users").insertOne({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created!" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function isValidEmail(email) {
  const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return email !== "" && email.match(emailFormat);
}

function isValidPassword(password) {
  return password !== "" && password.trim().length < 7;
}

export default handler;
