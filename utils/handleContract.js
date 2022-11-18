const { abi, address } = require('../lib/StakingContract.json')
const ethers = require('ethers')
require('dotenv').config()

const goerliProvider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_RPC)
const StakingContract = new ethers.Contract(address['0x5'], abi, goerliProvider)

const getAP = async (account) => {
  const AP = await StakingContract.calculateAqualisPower(account)
  const AP2num = Number(ethers.utils.formatEther(AP))
  return AP2num
}

module.exports = { getAP }