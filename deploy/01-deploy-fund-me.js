const hre = require("hardhat")
const {devlopmentChains,networkConfig} = require("../helper-hardhat-config")
module.exports = async({deployments})=>{
    //const firstAccount = ((await getNamedAccounts()).firstAccount)
    const [firstAccount, secondAccount] = await hre.ethers.getSigners()
    const deploy = deployments.deploy

    console.log("firstAccount " +firstAccount.address)
    let dataFeedAddr
    if(devlopmentChains.includes(network.name)) {
        dataFeedAddr = (await deployments.get("MockV3Aggregator")).address
    } else {
        dataFeedAddr =  networkConfig[hre.network.config.chainId].ethUsdDataFeed
        
    }
 console.log("ethUsdDataFeed " +dataFeedAddr)

    const fundMe = await deploy("FundMe",{
        from:firstAccount.address,
        args:[180,dataFeedAddr],
        log:true,
        waitConfirmations:3
    })

    if (hre.network.config.chainId == 11155111) {

        await hre.run("verify:verify", {
            address: fundMe.address,
            constructorArguments: [180,dataFeedAddr],
            });
    } else {
        console.log("Network is not sepolia")
    }


}

module.exports.tags = ["all","fundme"]