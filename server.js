import express from "express";
import moment from "moment";
import { default as chalk } from "chalk";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

const app = express();
const port = 3000;

const users = [];

async function getUsers() {
  try {
    const response = await axios.get("https://randomuser.me/api/");
    return response.data.results[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

function logUserStyle(req, res, next) {
  console.log(chalk.bgWhite.blue("lista de usuarios: "));
  console.log(chalk.bgWhite.blue(JSON.stringify(users, null, 2)));
  next();
}

app.get("/registrar", async (req, res) => {
  const user = await getUsers();
  if (user) {
    const id = uuidv4();
    const timestamp = moment().format("DD/MM/YYYY HH:mm:ss");
    const newUser = {
      id,
      nombre: user.name.first,
      fecha: timestamp,
    };
    users.push(newUser);
    res.json(newUser);
  } else {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

app.get("/users", logUserStyle, (req, res) => {
  const usersData = _.map(users, (user) => _.omit(user, "id"));
  res.json(usersData);
});

app.listen(port, () => {
  console.log(`funcionando en http://localhost:${port}`);
});
