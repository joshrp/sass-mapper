var finder = require('./finder'),
	crypto = require('crypto'),
	async = require('async'),
	fs = require('fs'),
	path = require('path'),
	methods = {
		getFiles: function (dir, cb) {
			finder.findAll(dir, function (err, files) {
				if (err) {
					cb (err);
				}

				files = files.map(function (file) {
					return file;
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
				cb(null, deps);
			});
		},
		getDependencyTree: function (dir, cb) {
			stats = fs.statSync(dir);
			var basedir,
				map = {};

			if (stats.isFile()) {
				basedir = path.dirname(dir);
			} else {
				basedir = dir;
			}

			methods.getFiles(dir, function (err, allFiles) {
				async.map(allFiles, function (file, cb) {
					methods.getDependencies(file, basedir, function (err, files) {
						var ret = [file, files];
						cb(err, ret);
					});
				}, function (err, results) {
					results.forEach(function (item) {
						map[path.relative(basedir, item[0])] = item[1];
					});
					cb (err, map);
				});

			});
		}
	};

module.exports = methods;