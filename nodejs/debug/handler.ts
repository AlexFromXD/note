const handler = async () => {
  console.log(1);
  console.log(2);
  console.log(3);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Debug SLS TS" }),
  };
};

export { handler };
