var finder = require('./finder'),
	crypto = require('crypto'),
	path = require('path'),
	methods = {
		getFiles: function (dir, cb) {
			var basedir = path.dirname(dir);

			finder.findAll(dir, function (err, files) {
				if (err) throw err;
				files = files.map(function (file) {
					return path.relative(basedir, file);
				});
				cb(err, files);
			});
		},
		getDependencies: function (file, basedir, cb) {
			var filePath = path.resolve(basedir, file);

			finder.getImportedFiles(filePath, function (err, imports) {
				var deps = imports.map(function (importFileName) {
					return finder.normaliseSassPath(importFileName, file, basedir);
				});
				cb(null, deps)
			});
		}
	};

module.exports = methods;