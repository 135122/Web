const {task} = require("hardhat/config")
task("intercat-fundme","deploy with fundme").addParam("addr","fundme contrace address").setAction(async(taskArgs,hre) => {
    const funMeFactory = await ethers.getContractFactory("FunMe")
    const fundMe = funMeFactory.attach(taskArgs.addr)
    const [firstAccount, secondAccount] = await ethers.getSigners()
    const fundRx = await fundMe.fund({value:ethers.parseEther("0.05")})
    await fundRx.wait()

    const balanceOfcaontract = await ethers.provider.getBalance(fundMe.target)
    console.log("Balance of the contrace " + balanceOfcaontract)

    const fundRxSecondAccount = await fundMe.connect(secondAccount).fund({value:ethers.parseEther("0.05")})
    await fundRxSecondAccount.wait()

    const balanceOfcaontractecondAccount = await ethers.provider.getBalance(fundMe.target)
    console.log("Balance of the contrace" + balanceOfcaontractecondAccount)

    const  firstAccountBalanceInFundMe = await fundMe.fundersToAmount(firstAccount.address)
    const  secondAccountBalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address)


    console.log("Balance of first  contrace" + firstAccount.address + "is" + firstAccountBalanceInFundMe)
    console.log("Balance of second  contrace" + secondAccount.address + "is" + secondAccountBalanceInFundMe)
})

module.exports = {}