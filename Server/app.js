const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { storeSensorValues, getStatistics, getPanelDetails } = require("./router");

const app = express();
const port = 9500;


app.use(cors());
app.use(bodyParser.json());

app.get('/store-values', storeSensorValues);
app.get('/get-values', getStatistics);

app.post('/panel-details', getPanelDetails);

app.get('/', (req, res) => res.json({message:"This is PV observation and analysis system for Dept. of Electrical and Electronics Engineering"}));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})
