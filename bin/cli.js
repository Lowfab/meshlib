#! /usr/bin/env node

var fs = require('fs'),
	path = require('path'),
	program = require('commander'),
	ndjson = require('ndjson'),


	meshlib = require('../build/index'),
	packageData = require('../package.json'),
	yaml = require('js-yaml'),
	indent = '\n\t\t\t      '


program
	.version(packageData.version)
	.option('--indent', 'Indent JSON output')
	.option('--js-object', 'Print a plain Javascript object')
	.option('--colors', 'Print a colored plain Javascript object')
	.option('--depth', 'Set depth for printing Javascript objects')

	.option('--build-face-vertex-mesh', 'Build a face vertex mesh from faces')

	.usage('<input-file> [options] <output-file>')
	.parse(process.argv)


if (process.stdin.isTTY) {

	if (program.args.length < 2)
		program.help()

	else {
		fs.readFile(program.args[0], function (error, fileBuffer) {

			var fileContent

			if (error)
				throw error

			if (/.*(yaml|yml)$/gi.test(program.args[0]))
				fileContent = yaml.safeLoad(fileBuffer)
			else
				fileContent = JSON.parse(fileBuffer)


			meshlib.Model
				.fromObject(fileContent)
				.getObject()
				.then(function (model) {

					var outputFilePath = path.join(
						process.cwd(),
						program.args.pop()
					)

					fs.writeFileSync(outputFilePath, JSON.stringify(model))
					process.exit(0)
				})
				.catch(function (error) {
					console.error(error.stack)
				})
		})
	}
}
else {
	var modelBuilder = new meshlib.ModelBuilder()

	modelBuilder.on('model', function (model) {

		var modelChain = model

		if (program.buildFaceVertexMesh)
			modelChain = modelChain.buildFaceVertexMesh()

		modelChain
			.getObject()
			.then(function (modelObject) {
				if (program.indent)
					console.log(JSON.stringify(modelObject, null, 2))
				else if (program.jsObject)
					console.dir(modelObject, {depth: program.depth || null})
				else if (program.colors)
					console.dir(modelObject, {
						depth: program.depth || null,
						colors: true
					})
				else
					console.log(JSON.stringify(modelObject))
			})
			.catch(function (error) {
				console.error(error.stack)
			})
	})

	modelBuilder.on('error', function (error) {
		console.error(error.stack)
		process.exit(1)
	})

	process.stdin.setEncoding('utf-8')
	process.stdin
		.pipe(ndjson.parse())
		.pipe(modelBuilder)
}
