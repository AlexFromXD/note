const { stat } = require("fs");

const handler = async () => {
  console.log(1);
  console.log(2);
  console.log(3);
  console.log(4);
  console.log(5);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Debug SLS JS" }),
  };
};

module.exports = { handler };
