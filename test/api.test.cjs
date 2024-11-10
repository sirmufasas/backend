import { expect } from "chai";
import chaiHttp from "chai-http";
import chai from "chai";

chai.use(chaiHttp);
const server = "http://44.196.3.200:8000";

describe("GET /userdata", () => {
  it("should return user data", function (done) {
    chai
      .request(server)
      .get("/User-data")
      .end((err, res) => {
        if (err) {
          console.error("Request Error:", err);
          return done(err);
        }
        try {
          console.log("Response:", res);
          console.log("Status Code:", res.status);
          console.log("Response Body: ===>", res.body.message);
          const users = res.body.message;
          expect(res).to.have.status(200);
          expect(users).to.be.an("array");
          console.log("First Element:", res.body[0]);
          expect(users[0]).to.have.property("_id");
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});
