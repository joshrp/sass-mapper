var recursive = require('recursive-readdir'),
	fs = require('fs'),
	sassPath = require('./sass-path'),
	path = require('path'),
	matcher = /^_?.*.s(c|a)ss$/;

module.exports = {
	findAll: function (dir, cb) {
		recursive(dir, function (err, allFiles) {
			if (err) {
				if (err.code === 'ENOTDIR') {
					allFiles = [dir];
				} else {
 					cb(err);
				}
			}
			var files = allFiles.filter(function (file) {
				return matcher.test(path.basename(file));
			}).map(function (file) {
				return path.resolve(file);
			});
			cb(null, files);
		});
	}
};