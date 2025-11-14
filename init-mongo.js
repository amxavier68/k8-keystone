db = db.getSiblingDB("kollabor8_seo");

db.createUser({
  user: "k8user",
  pwd: "seoEngine123!",
  roles: [
    { role: "readWrite", db: "kollabor8_seo" },
    { role: "read", db: "admin" }
  ]
});

print("✅ Created user 'k8user' for database 'kollabor8_seo'");
