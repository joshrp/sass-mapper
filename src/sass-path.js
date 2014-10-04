var path = require('path');

methods = {
	getPaths: function (importPath, currentFile, baseDir) {
		var basicPath = path.resolve(baseDir, path.dirname(currentFile), importPath),
			relPath = path.dirname(path.relative(baseDir, basicPath)),
			basicName = path.basename(basicPath),
			extName = path.extname(basicPath),
			names = [];

		if (extName === '') {
			names.push(basicName + '.scss');
			names.push(basicName + '.sass');
		} else if (['.scss','.sass'].indexOf(extName) !== -1) {
			names.push(basicName);
		}

		if (basicName.substr(0,1) !== '_') {
			names.forEach(function (name) {
				names.push('_' + name);
			});
		}
		return names.map(function (name) {
			if (relPath !== '.') {
				return relPath +'/'+ name;
			} else {
				return name;
			}
		});
	}
};

module.exports = methods;