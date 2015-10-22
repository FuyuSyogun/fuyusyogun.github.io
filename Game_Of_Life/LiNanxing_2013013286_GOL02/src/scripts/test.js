var main = require('./logic.js');
var should = require('chai').should();
describe('Testing getNeighbour function', function () {
	it('in a given 5x5 map', function () {
		main.initializeMap(5, 5, 0);
		for(var i = 1; i < 5; i++){
			(main.map)[i][0] = !(main.map)[i - 1][0];
		}
		for(var i = 0; i < 5; i++){
			for(var j = 1; j < 5; j++)
				(main.map)[i][j] = !(main.map)[i][j - 1];
		}
		main.getNeighbour(0, 0).should.equal(4);
		main.getNeighbour(1, 1).should.equal(6);
		main.getNeighbour(0, 1).should.equal(3);
		main.getNeighbour(2, 2).should.equal(4);
		main.getNeighbour(2, 3).should.equal(3);
		main.getNeighbour(4, 4).should.equal(4);
		main.getNeighbour(1, 4).should.equal(3);
	});
	it('in a randomly generated 5x5 map', function () {
		for(var i = 0; i < 10; i++){
			main.initializeMap(5, 5, 0.5);
			num = (main.map)[0][2] + (main.map)[1][2] + (main.map)[3][2] + (main.map)[4][2] + (main.map)[2][0] + (main.map)[2][1] + (main.map)[2][3] + (main.map)[2][4];
			main.getNeighbour(2, 2).should.equal(num);
		}
	});
});

describe('Testing grow function', function () {
	it('in a given 5x5 map', function () {
		main.initializeMap(5, 5, 0);
		for(var i = 1; i < 5; i++){
			(main.map)[i][0] = !(main.map)[i - 1][0];
		}
		for(var i = 0; i < 4; i++){
			for(var j = 1; j < 5; j++)
				(main.map)[i][j] = !(main.map)[i][j - 1];
		}
		main.grow();
		(main.map)[2][3].should.equal(true);
		(main.map)[2][4].should.equal(0);
		(main.map)[2][2].should.equal(0);
		(main.map)[2][1].should.equal(true);
		(main.map)[1][3].should.equal(0);
		(main.map)[0][3].should.equal(true);
		(main.map)[4][3].should.equal(0);
	});
});

describe('Testing reset function', function () {
	it('after reseting a randomly generated 100x100 map', function () {
		main.initializeMap(100, 100, 0.5);
		main.reset();
		for(var i = 0; i < 100; i++)
			for(var j = 0; j < 100; j++)
				(main.map)[2][3].should.equal(0);
	});
});

describe('Testing initializeMap function', function () {
	it('testing setting effectivity', function () {
		main.initializeMap(100, 100, 0.5);
		main.returnWidth().should.equal(100);
		main.returnHeight().should.equal(100);
		main.returnRate().should.equal(0.5);

		main.initializeMap(30, 77, 0.6);
		main.returnWidth().should.equal(30);
		main.returnHeight().should.equal(77);
		main.returnRate().should.equal(0.6);

		main.initializeMap(12, 73, 0.1);
		main.returnWidth().should.equal(12);
		main.returnHeight().should.equal(73);
		main.returnRate().should.equal(0.1);

		main.initializeMap(63, 23, 0.33);
		main.returnWidth().should.equal(63);
		main.returnHeight().should.equal(23);
		main.returnRate().should.equal(0.33);
	});
	it('testing random rate generation effectivity', function () {
		for(var i = 0; i < 10; i++){
			rate = Math.random();
			var num = 0;
			for(var j = 0; j < 10; j++){
				main.initializeMap(100, 100, rate);
				num += main.returnLives();
			}
			((num / (100 * 100 * 10)) / rate).should.be.within(0.98, 1.02);
		}
	});
});