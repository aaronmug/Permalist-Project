import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "9311",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items");
    items = result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.log("Error fetching items");
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;

  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  } catch (error) {
    console.log("Error inserting item");
  }
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId;
  const updateTitle = req.body.updatedItemTitle;
  try {
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [
      updateTitle,
      id,
    ]);
    res.redirect("/");
  } catch (error) {
    console.log("Update Error");
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (error) {
    console.log("Delete item error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
