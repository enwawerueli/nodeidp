const express = require("express");
const samlp = require("samlp");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;
const IDP_ID = "http://example.com";
const ACS_POST_URL = "https://sptest.iamshowcase.com/acs";
// const ACS_POST_URL = "https://samltest.id/Shibboleth.sso/SAML2/POST";

app.set("views", "./templates");
app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/signin", (req, res) => res.render("login.pug", { req }));

app.post(
  "/sso",
  samlp.auth({
    issuer: IDP_ID,
    cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
    key: fs.readFileSync(path.join(__dirname, "key.pem")),
    getPostURL(audience, authnRequestDom, req, callback) {
      return callback(null, ACS_POST_URL);
    },
    getUserFromRequest(req) {
      // return a fake user
      return {
        id: req.body.username,
        name: { familyName: "Doe", givenName: "John" },
        emails: [{ type: "work", value: "jdoe@example.com" }],
      };
    },
  })
);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
