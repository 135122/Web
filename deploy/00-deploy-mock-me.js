const hre = require("hardhat")
const {DECIMAL,INITIAL_ANSWER,devlopmentChains} = require("../helper-hardhat-config")
module.exports = async({deployments})=>{
    //const firstAccount = ((await getNamedAccounts()).fi
    // rstAccount)
    if(devlopmentChains.includes(network.name)) {
  

        const [firstAccount, secondAccount] = await hre.ethers.getSigners()
        const deploy = deployments.deploy

        console.log("firstAccount " +firstAccount.address)


        await deploy("MockV3Aggregator",{
            from:firstAccount.address,
            args:[DECIMAL,INITIAL_ANSWER],
            log:true
        })
    } else {
        console.log("envirmmet is not local")
    }
}

module.exports.tags = ["all","mock"]