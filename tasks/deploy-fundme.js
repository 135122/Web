const {task} = require("hardhat/config")
task("deploy-fundme","deploy with fundme").setAction(async(taskArgs,hre) => {
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log("contract deploy");
    const fundMe = await fundMeFactory.deploy(180)
    await fundMe.waitForDeployment()
    console.log("contract has been deploy sucessfully,contract address is" + fundMe.target);
    if (hre.network.config.chainId == 11155111) {
        console.log("Waiting for 5 confirmations")
        await fundMe.deploymentTransaction().wait(2)
        await verdfyFundMe(fundMe.target,[10])
    } else {
        console.log("verification skipped ... ")
    }
    
})

async function verdfyFundMe(fundMeAddr, args) {
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
        });
}
