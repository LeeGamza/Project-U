db = db.getSiblingDB("mydatabase");
db.createUser({
  user: "appuser",
  pwd: "appuserpassword",
  roles: [{ role: "readWrite", db: "mydatabase" }],
});
db.mycollection.insertOne({ key: "value" });
