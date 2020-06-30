const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { getTrackAndTrace } = require("./src/dpdCrawler");

const PORT = process.env.PORT || 8888;
var app = express();

//Middlewarez
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

// const jwtCheck = jwt({
//   secret: jwksRsa.expressJwtSecret({
//       cache: true,
//       rateLimit: true,
//       jwksRequestsPerMinute: 5,
//       jwksUri: 'https://cloresy.eu.auth0.com/.well-known/jwks.json'
// }),
// audience: 'https://dpCrawler.io',
// issuer: 'https://cloresy.eu.auth0.com/',
// algorithms: ['RS256']
// });

// app.use(jwtCheck)

app.get("/api/v1/trace/:orderid", async (req, res, next) => {
   var orderid = req.params.orderid
   data = await getTrackAndTrace(orderid)
   res.json(data)
});

// Creating an instance
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
