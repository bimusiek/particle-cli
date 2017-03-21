var spawn = require('child_process').spawn;
var extend = require('xtend');

/***
 * Executes a command, collecting the output from stdout and stderr.
 * @param cmd
 * @param args
 * @param cb callback that receives (error, exitCode, stdout, stderr)
 */
function runCommand(cmd, args, cb) {

	// set locale so we can be sure of consistency of command execution
	var env = extend(process.env, { LANG: "en", LC_ALL: "en", LC_MESSAGES: "en"});

	var argArray = Array.isArray(args) ? args : args.split(' ');

	var s = spawn(cmd, argArray, {
		stdio: ['ignore', 'pipe', 'pipe']
	});

	var stdout = '';
	s.stdout.on('data', function (data) {
		stdout += data;
	});

	var stderr = '';
	s.stderr.on('data', function (data) {
		stderr += data;
	});

	s.on('error', function (error) {
		cb(error, null, stdout, stderr);
	});

	s.on('close', function (code) {
		cb(null, code, stdout, stderr);
	});
}

module.exports = {
	runCommand: runCommand
};