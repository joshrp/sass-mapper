var mocha = require('mocha'),
	chai = require('chai').should(),
	path = require('path'),
	fixturesDir = path.resolve('fixtures'),
	standardDir = fixturesDir + '/standard';

describe('Finder', function () {
	it('should find files correctly', function (done) {
		var finder = require('./src/finder');
		finder.findAll(standardDir, function (err, 	files) {
			files.length.should.equal(10);
			done();
		});
	});
});

describe('Import Paths', function () {
	var sassPath = require('./src/sass-path');
	it('should return possible variants of a simple file name', function () {
		paths = sassPath.getPaths('allTypes', 'main.scss', standardDir);
		paths.length.should.equal(4);
		paths.should.contain('./allTypes.scss');
		paths.should.contain('./allTypes.sass');
		paths.should.contain('./_allTypes.scss');
		paths.should.contain('./_allTypes.sass');
	});

	it('should respect existing extensions', function () {
		paths = sassPath.getPaths('scssOnly.scss', 'main.scss', standardDir);
		paths.length.should.equal(2);
		paths.should.contain('./scssOnly.scss');
		paths.should.contain('./_scssOnly.scss');
	});

	it('should respect existing underscores', function () {
		paths = sassPath.getPaths('_underscored', 'main.scss', standardDir);
		paths.length.should.equal(2);
		paths.should.contain('./_underscored.scss');
		paths.should.contain('./_underscored.sass');
	});

	it('should respect whole file names', function () {
		paths = sassPath.getPaths('_simpleFile.scss', 'main.scss', standardDir);
		paths.length.should.equal(1);
		paths[0].should.equal('./_simpleFile.scss');
	});

	it ('should return all paths relative to the base directory', function () {		
		paths = sassPath.getPaths('../_component.scss', 'partials/page1/main.scss', standardDir);
		paths.length.should.equal(1);
		paths[0].should.equal('partials/_component.scss');		

		paths = sassPath.getPaths('../../other-project/someOtherProject.scss', 'partials/main.scss', standardDir);
		paths.length.should.equal(2);
		paths[0].should.equal('../other-project/someOtherProject.scss');
		paths[1].should.equal('../other-project/_someOtherProject.scss');

		paths = sassPath.getPaths('../page2/_thing.scss', 'partials/page1/main.scss', standardDir);
		paths.length.should.equal(1);
		paths[0].should.equal('partials/page2/_thing.scss');
	});
});

describe('Mapper', function () {
	it('should return each file relative to the base directory', function (done) {
		var mapper = require('./src/mapper');
		mapper.getFiles(standardDir, function (err, files) {
			files.length.should.equal(10);
			files.forEach(function (file){
				file.should.not.match(new RegExp('^' + standardDir));
			});	
			done();
		});
	});

	// it('should assign basic relationships', function (done) {
	// 	var mapper = require('./src/mapper');
	// 	mapper.getFiles(standardDir, function (err, files) {
	// 		files.length.should.equal(6);
	// 		files[0].dependsOn.length.should.equal(2);
	// 		done();
	// 	});
	// });
});