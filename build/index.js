// Generated by CoffeeScript 1.9.0
(function() {
  var Stl, importFileBuffer, meshData, meshlib, model, optimizeModel, stlExport, toArrayBuffer;

  Stl = require('./Stl');

  stlExport = require('./stlExport');

  optimizeModel = require('./optimizeModel');

  importFileBuffer = '';

  meshlib = {};

  meshData = {};

  model = {};

  toArrayBuffer = function(buffer) {
    var i, tempArrayBuffer, view, _i, _ref;
    if (Buffer && Buffer.isBuffer(buffer)) {
      tempArrayBuffer = new ArrayBuffer(buffer.length);
      view = new Uint8Array(tempArrayBuffer);
      for (i = _i = 0, _ref = buffer.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        view[i] = buffer[i];
      }
      return tempArrayBuffer;
    } else {
      return buffer;
    }
  };

  meshlib.meshData = function() {
    return meshData;
  };

  meshlib.model = function(newModel) {
    model = newModel;
    return meshlib;
  };

  meshlib.optimize = function() {
    return model = optimizeModel(model);
  };

  meshlib["export"] = function(options, callback) {
    var stlFile;
    if (options == null) {
      options = {};
    }
    if (options.format == null) {
      options.format = 'stl';
    }
    if (options.encoding == null) {
      options.encoding = 'binary';
    }
    if (options.format === 'stl') {
      if (options.encoding === 'ascii') {
        stlFile = stlExport.toAsciiStl(model);
      } else {
        stlFile = stlExport.toBinaryStl(model);
      }
      callback(null, stlFile);
    } else {
      throw new Error(options.format + ' is no supported file format!');
    }
    return meshlib;
  };

  meshlib.parse = function(fileBuffer, options, callback) {
    var error, stl;
    if (!fileBuffer) {
      throw new Error('STL buffer is empty');
    } else {
      importFileBuffer = fileBuffer;
    }
    if (options == null) {
      options = {};
    }
    if (options.format == null) {
      options.format = 'stl';
    }
    if (options.format === 'stl') {
      try {
        stl = new Stl(toArrayBuffer(fileBuffer));
        model = stl.model();
      } catch (_error) {
        error = _error;
        if (typeof callback === 'function') {
          callback(error);
          return meshlib;
        } else {
          throw error;
        }
      }
    }
    if (typeof callback === 'function') {
      callback(null, model);
    }
    return meshlib;
  };

  module.exports = meshlib;

}).call(this);
