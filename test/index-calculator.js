'use strict';
var calculator = require("../lib/index-calculator")

describe('calculateIndex', function () {
 
 it('should calculate no indicators correctly', function (done) {
   var indicators = [];
   calculator.calculateIndex(indicators).should.eql(0);
   done();
 });

 it('should calculate null indicators correctly', function (done) {
   var indicators = null;
   calculator.calculateIndex(indicators).should.eql(0);
   done();
 });

 it('should calculate assorted indicators correctly', function (done) {
   var indicators = [1,1,1,1,-1,-1];
   calculator.calculateIndex(indicators).should.eql(33);
   done();
 });

 it('should calculate a Zero index', function (done) {
   var indicators = [1,1,1,-1,-1,-1];
   calculator.calculateIndex(indicators).should.eql(0);
   done();
 });

 it('should calculate a 100 index', function (done) {
   var indicators = [1,1,1];
   calculator.calculateIndex(indicators).should.eql(100);
   done();
 });

 it('should calculate a -100 index', function (done) {
   var indicators = [-1,-1,-1];
   calculator.calculateIndex(indicators).should.eql(-100);
   done();
 });

});