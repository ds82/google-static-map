'use strict';

var request    = require('request');
var gm         = require('googlemaps');

var GoogleStaticMap = function( consoleKey, opts ) {
  opts = opts || {};
  if ( !consoleKey ) {
    throw new Error('You must provide a google api console key');
  }

  gm.config('console-key', consoleKey );

  this.values = {};
  this.values.last = null;
  this.values.url = null;

  this.config = {};
  this.config.style = {
    feature: 'road',
    element: 'all',
    rules: {
      hue: '0x00ff00'
    }
  };

  this.config.markers = [{
    'location': '',
    'color': 'blue',
    'label': '',
    'shadow': 'false'
  }];

  this.config.paths = [];

  this.config.zoom = 15;
  this.config.resolution = '480x300';
  this.config.maptype = 'roadmap';

  this.config.address = null;

  //
  // config getter ./. setter
  //

  var genericConfigHandler = (function ( configKey, value ) {
    if ( !value ) { return this.config[configKey]; }
    else {
      this.config[configKey] = value;
      return this;
    }
  }).bind( this );

  this.style = function( style ) {
    return genericConfigHandler( 'style', style );
  };

  this.markers = function( markers ) {
    return genericConfigHandler( 'markers', markers );
  };

  this.zoom = function( zoom ) {
    return genericConfigHandler( 'zoom', zoom );
  };

  this.resolution = function( resolution ) {
    return genericConfigHandler( 'resolution', resolution );
  };

  this.mapType = function( mapType ) {
    return genericConfigHandler( 'mapType', mapType );
  };

  this.address = function( address ) {
    if ( address ) {
      this.config.markers[0].location = address;
    }
    return genericConfigHandler( 'address', address );
  };

  //
  // methods
  //

  this.done = function() {
    return this.values.last;
  };

  this.url = function() {
    this.values.last = this.values.url = gm.staticMap( this.config.address,
      this.config.zoom,
      this.config.resolution,
      false,
      false,
      this.config.mapType,
      this.config.markers,
      this.config.style,
      this.config.paths
    );
    return this;
  };

  this.staticMap = function() {
    if ( ! this.values.url ) { this.url(); }
    this.values.last = request( this.values.url );
    return this;
  };
};

module.exports = function( consoleKey, opts ) {
  console.log( 'consoleKey', consoleKey );
  return new GoogleStaticMap( consoleKey, opts );
};

module.exports.set = function( key ) {
  var consoleKey = key;
  return function( opts ) {
    return new GoogleStaticMap( consoleKey, opts );
  };
};



