require("@nomiclabs/hardhat-waffle");
require("hardhat-abi-exporter");
require("dotenv").config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.10",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mainnet: {
      url: process.env.SEPOLIA_ALCHEMY,
      accounts: [process.env.PRIVATE_KEY],
    },
    sepolia: {
      url: process.env.SEPOLIA_ALCHEMY,
      accounts: [process.env.PRIVATE_KEY],
    },
    goerli: {
      url: process.env.GOERLI_ALCHEMY,
      accounts: [process.env.PRIVATE_KEY],
    },
    PolygonZkEVM: {
      url: process.env.POLYGONZKEVM_ALCHEMY,
      accounts: [process.env.PRIVATE_KEY],
    },
    scrollAlpha: {
      url: "https://alpha-rpc.scroll.io/l2" || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  }, 
  
  abiExporter: {
    path: "../next-app/contracts/ABI",
    runOnCompile: true,
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: false,
  },
  etherscan: {
    api: process.env.ETHERSCAN_KEY,
  },
};
