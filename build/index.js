// Generated by CoffeeScript 1.8.0
(function() {
  var Model, Stl, importFileBuffer, meshData, meshlib, model, optimizeModel, parseBuffer, stlExport, toArrayBuffer;

  Stl = require('./Stl');

  stlExport = require('./stlExport');

  optimizeModel = require('./optimizeModel');

  importFileBuffer = '';

  meshlib = {};

  meshData = {};

  model = {};

  Model = (function() {
    function Model(mesh, options) {
      this.mesh = mesh;
      this.options = options;
    }

    return Model;

  })();

  parseBuffer = function(fileBuffer, options) {
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
    return model;
  };

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

  meshlib = function(model, options) {
    if ((model.positions == null) || (model.indices == null) || (model.vertexNormals == null) || (model.faceNormals == null)) {
      model = parseBuffer(model, options);
    }
    return new Model(model, options);
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

  meshlib.separateGeometry = require('./separateGeometry');

  meshlib.OptimizedModel = require('./OptimizedModel');

  meshlib.StlLoader = require('./Stl');

  meshlib.Vec3 = require('./Vector');

  module.exports = meshlib;

}).call(this);
