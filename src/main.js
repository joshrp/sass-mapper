var path = process.argv[2],
  mapper = require("./mapper");

mapper.getDependencyTree(path, function(err, map) {
  if (err) throw err;

  process.stdout.write(JSON.stringify(map));
});
