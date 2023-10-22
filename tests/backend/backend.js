var logTestResult = function(testName, passed) {
  const color = passed ? '\x1b[38;2;255;255;255m' : '\x1b[38;2;255;255;255m'; // White for both pass and fail
  const bgColor = passed ? '\x1b[48;2;80;255;80m' : '\x1b[48;2;255;80;80m'; // Lime green for pass, Light red for fail
  const resetColor = '\x1b[0m';
  const result = passed ? 'PASS' : 'FAIL';

  console.log(`${bgColor}${color}${result}${resetColor} Test: ${testName}`);
}

var packetgun = require("packetgun-backend");

packetgun.init();

// Listen for requests
packetgun.listen.classic(4321, function (client) {
  // Got request

  try {
      // Your tests
      if (client.exit_code !== 0) {
          throw new Error('exit_code is not 0');
      }

      if (client.client_exit_code !== 0) {
          throw new Error('client_exit_code is not 0');
      }

      if (client.data !== "Hello world!") {
          throw new Error('data is not "Hello world!"');
      }

      logTestResult('Check if exit_code is 0', true);
      logTestResult('Check if client_exit_code is 0', true);
      logTestResult('Check if data is "Hello world!"', true);

      // Return a response
      return {
          exit_code: 0,
          data: "Hello world!"
      }
  } catch (error) {
      logTestResult(error.message, false);

      return {
          exit_code: 1, // Indicate a test failure
          error_message: error.message
      };
  }
});
