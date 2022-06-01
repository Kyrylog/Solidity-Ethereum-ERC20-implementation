const Yesin = artifacts.require("Yesin");

module.exports = function (deployer) {
  deployer.deploy(Yesin, 400);
};
