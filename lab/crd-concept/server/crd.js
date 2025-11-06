const crdRouter = require("express").Router();

/**
 * {
 *    [crdName: string]: {
 *       [resourceName: string]: {
 *         metadata: {}
 *           name: string;
 *         }
 *       }
 *     }
 */
const crd = {};

function listCRDs() {
  return Object.keys(crd);
}

function listCRDResources(name) {
  return crd[name] ? Object.keys(crd[name]) : [];
}

function createCRD(name) {
  if (!crd[name]) {
    crd[name] = {};
  }
}

function findCRD(name) {
  return crd[name];
}

crdRouter
  .get("/", (req, res) => {
    res.json(listCRDs());
  })
  .post("/", (req, res) => {
    const crdName = req.body.metadata.name;
    createCRD(crdName);
    res.status(201).json({ message: `crd/${crdName} Created` });
  })
  .get("/:crdName", (req, res) => {
    const crdName = req.params.crdName;
    const crdData = findCRD(crdName);
    if (crdData) {
      res.json(listCRDResources(crdName));
    } else {
      res.status(404).json({ message: `crd/${crdName} Not Found` });
    }
  })
  .post("/:crdName", (req, res) => {
    const crdName = req.params.crdName;
    const crdData = findCRD(crdName);
    if (!crdData) {
      res.status(404).json({ message: `crd/${crdName} Not Found` });
    } else {
      crdData[req.body.metadata.name] = req.body;
      res.json({
        message: `crd/${crdName} ${req.body.metadata.name} Created`,
      });
    }
  })
  .get("/:crdName/:resourceName", (req, res) => {
    const crdName = req.params.crdName;
    const crd = findCRD(crdName);
    if (!crd) {
      return res.status(404).json({ message: `crd/${crdName} Not Found` });
    }

    const resourceName = req.params.resourceName;
    const resource = crd[resourceName];
    if (!resource) {
      return res.status(404).json({
        message: `crd/${crdName} ${resourceName} Not Found`,
      });
    }

    return res.json(resource);
  });

module.exports = {
  crdRouter,
};
