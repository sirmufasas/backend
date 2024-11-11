import { expect } from "chai";
import chaiHttp from "chai-http";
import chai from "chai";

chai.use(chaiHttp);
const server = "http://44.196.3.200:8000";

// GET /users
describe("GET /users", () => {
  it("should return user data", function (done) {
    chai
      .request(server)
      .get("/users")
      .end((err, res) => {
        if (err) return done(err);
        try {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body[0]).to.have.property("_id", "671e9e3caa2ad5a2d1c886be");
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});

// GET user by email
describe("GET /users/:email", () => {
  it("should return a single user by email", function (done) {
    const sampleEmail = "sirmufasa@gmail.com"; 
    chai
      .request(server)
      .get(`/users/${sampleEmail}`)
      .end((err, res) => {
        if (err) return done(err);
        try {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("email", sampleEmail);
          expect(res.body).to.have.property("password", "muffasa082twerdfhnfjkfhj");
          expect(res.body).to.have.property("createdAt", "2024-10-27T20:10:36.695+00:00");
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});

// POST /api/data
describe("POST /api/data", () => {
  it("should create a new user and return user data", function (done) {
    const userData = {
      name: "Jonathan Kabango",
      email: "jonathankabango08@gmail.com",
      Age: "25",
      password: "jkpassword123"
    };

    chai
      .request(server)
      .post("/api/data")
      .send(userData)
      .end((err, res) => {
        if (err) return done(err);
        try {
          expect(res).to.have.status(201);
          expect(res.body.data).to.include(userData);
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});

// GET all AvailableProducts
describe("GET /Availableproducts", () => {
  it("should return Availableproducts data", function (done) {
    chai
      .request(server)
      .get("/Availableproducts")
      .end((err, res) => {
        if (err) return done(err);
        try {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});

// GET AvailableProduct by ID
describe("GET /Availableproducts/:id", () => {
  it("should return a single product by ID", function (done) {
    const ObjectId = "670e4641a48092e99f861c99";
    chai
      .request(server)
      .get(`/Availableproducts/${ObjectId}`)
      .end((err, res) => {
        if (err) return done(err);
        try {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("_id", ObjectId);
          expect(res.body).to.have.property("product_name", "Rev");
          expect(res.body).to.have.property("product_description", "In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at,…");
          expect(res.body).to.have.property("product_price", 399.68);
          expect(res.body).to.have.property("product_category", "Sports");
          expect(res.body).to.have.property("product_brand", "Mybuzz");
          expect(res.body).to.have.property("product_color", "Aquamarine");
          expect(res.body).to.have.property("product_material", "Wood");
          expect(res.body).to.have.property("product_rating", 2.5);
          expect(res.body).to.have.property("product_stock_quantity", 108);
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});

// POST /Availableproducts
describe("POST /Availableproducts", () => {
  it("should create a new product and return product data", function (done) {
    const productData = {
      product_name: "Rev",
      product_description: "In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at,…",
      product_price: 399.68,
      product_category: "Sports",
      product_brand: "Mybuzz",
      product_color: "Aquamarine",
      product_material: "Wood",
      product_rating: 2.5,
      product_stock_quantity: 108
    };

    chai
      .request(server)
      .post("/Availableproducts")
      .send(productData)
      .end((err, res) => {
        if (err) return done(err);
        try {
          expect(res).to.have.status(201);
          expect(res.body.data).to.include(productData);
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});

// GET all Possiblelocations
describe("GET /possiblelocation", () => {
  it("should return Possiblelocations data", function (done) {
    chai
      .request(server)
      .get("/possiblelocation")
      .end((err, res) => {
        if (err) return done(err);
        try {
          expect(res).to.have.status(200);
          expect(res.body.data).to.be.an("array");
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});

// POST /possiblelocation
describe("POST /possiblelocation", () => {
  it("should create a new possible location", function (done) {
    const locationData = {
      Country: "Nigeria",
      Province: "Kano State",
      City: "Kano",
      Userid: "8722449ect48c59ab504fdes"
    };

    chai
      .request(server)
      .post("/possiblelocation")
      .send(locationData)
      .end((err, res) => {
        if (err) return done(err);
        try {
          expect(res).to.have.status(201);
          expect(res.body.data).to.include(locationData);
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});

// GET /userdata
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
          console.log("First Element:", users[0]);
          expect(users[0]).to.have.property("_id");
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});
