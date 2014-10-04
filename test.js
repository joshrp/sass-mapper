var mocha = require('mocha'),
	chai = require('chai').should(),
	path = require('path'),
	fixturesDir = path.resolve('fixtures'),
	standardDir = fixturesDir + '/standard';
	ambiguousDir = fixturesDir + '/ambiguous';

describe('Finder', function () {
	var finder = require('./src/finder');
	it('should find files correctly', function (done) {
		finder.findAll(standardDir, function (err, 	files) {
			files.length.should.equal(10);
			done();
		});
	});

	it('should get basic imported files from file', function (done) {
		finder.getImportedFiles(standardDir + '/main.scss', function (err, files) {
			files.length.should.equal(2);
			files[0].should.equal('./utils/tool.scss');
			files[1].should.equal('page1');
			done();
		});		
	});

	it('should get imported files anywhere in the file', function (done) {
		finder.getImportedFiles(standardDir + '/_page1.scss', function (err, files) {
			files.length.should.equal(3);
			files[0].should.equal('partials/page1/banner');
			files[1].should.equal('partials/page1/content');
			files[2].should.equal('partials/page1/footer');
			done();
		});
	});

	it('should find existing paths for sass imports', function () {
		path = finder.normaliseSassPath('global', './utils/_tool.scss', standardDir);
		path.should.equal('utils/global.scss');
	});

	it('should throw an error for ambiguous matches', function () {
		(function () {
			path = finder.normaliseSassPath('somestuff', './main.scss', ambiguousDir);
			path.should.equal('utils/global.scss');		
		}).should.throw()
	})
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

	it('should get file dependencies', function (done) {
		var mapper = require('./src/mapper');
		mapper.getDependencies(standardDir + '/utils/_tool.scss', standardDir, function (err, files) {
			files.length.should.equal(2);
			files[0].should.equal('utils/_common.scss');
			files[1].should.equal('utils/global.scss');
			done();
		});		
	});

	it('should get file dependencies outside of the base dir', function (done) {
		var mapper = require('./src/mapper');
		mapper.getDependencies('_content.scss', standardDir + '/partials/page1', function (err, files) {
			files.length.should.equal(1);
			files[0].should.equal('../list/_main.scss');
			done();
		});
	});
});