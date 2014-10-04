var recursive = require('recursive-readdir'),
	fs = require('fs'),
	byline = require('byline'),
	path = require('path'),
	sassFileMatcher = /^_?.*.s(c|a)ss$/;
	importMatcher = /^@import ("|')([^"']*)("|');$/;

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
				return sassFileMatcher.test(path.basename(file));
			}).map(function (file) {
				return path.resolve(file);
			});
			cb(null, files);
		});
	},

	getImportedFiles: function (file, baseDir, cb) {
		var abPath = path.resolve(baseDir, file),
			imports = [];

		byline(fs.createReadStream(abPath))
			.on('data', function (chunk) {
				matches = importMatcher.exec(chunk);
				if (matches !== null) {
					imports.push(matches[2]);
				}
			})
			.on('end', function () {
				cb(null, imports);
			})
			.setEncoding('utf-8');
	}
};