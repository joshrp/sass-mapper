var recursive = require('recursive-readdir'),
	fs = require('fs'),
	byline = require('byline'),
	sassPath = require('./sass-path'),
	path = require('path'),
	sassFileMatcher = /^_?.*.s(c|a)ss$/;
	importMatcher = /^@import ("|')([^"']*)("|');?$/;

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

	getImportedFiles: function (file, cb) {
		var imports = [];

		byline(fs.createReadStream(file))
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
	},

	normaliseSassPath: function (importPath, file, basedir) {
		paths = sassPath.getPaths(importPath, file, basedir);
		var possible = paths.filter(function (file) {
			return fs.existsSync(basedir + '/' + file);
		});
		if (possible.length > 1) {
			throw new Error('Ambiguous match for ' + importPath + ' in ' + file);
		} else {
			return possible[0];
		}
	}
};