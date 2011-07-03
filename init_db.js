
var redis = require("redis"),
    redis_client = redis.createClient();


var table = [];
groups = ['minimal', 'progressive', 'hiphop'];
for (var key in groups) {
  for (var k = 0; k < 8; k++) {
    for (var i = 0; i < 32; i++) {
      redis_client.hset(groups[key] +':table', i +':'+ k, 0);
    }
  }
}
