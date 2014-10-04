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
	};

module.exports = methods;