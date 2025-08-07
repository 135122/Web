const { ethers } = require("hardhat")

async function  main() {
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

    const [firstAccount, secondAccount] = await ethers.getSigners()
    const fundRx = await fundMe.fund({value:ethers.parseEther("0.05")})
    await fundRx.wait()

    const balanceOfcaontract = await ethers.provider.getBalance(fundMe.target)
    console.log("Balance of the contrace" + balanceOfcaontract)

    const fundRxSecondAccount = await fundMe.connect(secondAccount).fund({value:ethers.parseEther("0.05")})
    await fundRxSecondAccount.wait()

    const balanceOfcaontractecondAccount = await ethers.provider.getBalance(fundMe.target)
    console.log("Balance of the contrace" + balanceOfcaontractecondAccount)

    const  firstAccountBalanceInFundMe = await fundMe.fundersToAmount(firstAccount.address)
    const  secondAccountBalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address)


    console.log("Balance of first  contrace" + firstAccount.address + "is" + firstAccountBalanceInFundMe)
    console.log("Balance of second  contrace" + secondAccount.address + "is" + secondAccountBalanceInFundMe)
}






async function verdfyFundMe(fundMeAddr, args) {
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
        });
}

main().then().catch((error) => {
    console.error(error)
    process.exit(1)
})