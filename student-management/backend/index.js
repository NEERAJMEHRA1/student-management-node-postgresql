require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;


// Add this route BEFORE starting the server
app.get("/", (req, res) => {
  res.send("Hello Neeraj!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
