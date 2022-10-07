export type B1Job = {
  handler: 'b1JobHandler';
  param: [b1JobHandlerParam];
};

type b1JobHandlerParam = {
  name: string;
};
