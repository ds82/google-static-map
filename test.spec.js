'use strict';

var proxy = require('proxyquire');
var stubs = {
  googlemaps:    jasmine.createSpyObj('googlemaps', ['staticMap']),
  request:       jasmine.createSpy('request'),
  '@noCallThru': true
};

describe('google-static-map', function() {

  var uut;

  describe('without auto-setting a key', function() {

    beforeEach(function() {
      uut = proxy('./index', stubs );
    });

    it('should not work without a api key', function() {
      expect( uut ).toThrow(new Error('You must provide a google api console key'));
    });

    it('should provide a method to set a global api key', function() {
      expect( uut.set ).toBeDefined();
      uut = uut.set('some-key');
      expect( uut ).not.toThrow( jasmine.any( Error ));
    });

  });

  describe('with auto-setting a key', function() {

    beforeEach(function() {
      uut = proxy('./index', stubs ).set('some-key');
    });

    it('should get/set config options', function() {
      var map = uut();
      var set;

      ['zoom', 'resolution', 'mapType', 'markers', 'style'].forEach(function( key ) {
        set = key + ' ' + key;
        expect( map.config[key] ).toEqual( map[key]() );
        var chain = map[key]( set );
        expect( map.config[key] ).toEqual( set );

        expect( chain ).toEqual( map );
      });
    });

    it('should relay staticMap call to googlemaps module', function() {
      var map = uut();

      var testAddress = 'Some Address, Some Country';
      var staticMapReturn = 'http://some.where';
      var requestReturn = 'request-return-value';

      stubs.googlemaps.staticMap.andReturn( staticMapReturn );
      stubs.request.andReturn( requestReturn );

      var stream = map.address( testAddress ).staticMap().done();

      expect( stream ).toEqual('request-return-value');
      expect( stubs.googlemaps.staticMap ).toHaveBeenCalledWith(
        testAddress,
        map.config.zoom,
        map.config.resolution,
        false,
        false,
        map.config.mapType,
        map.config.markers,
        map.config.style,
        map.config.paths
      );
      expect( stubs.request ).toHaveBeenCalledWith( staticMapReturn );
    });

  });



});
