const {ethers,deployments,getNamedAccounts, network} = require("hardhat")
const {assert,expect} = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")

const {devlopmentChains} = require("../helper-hardhat-config")



!devlopmentChains.includes(network.name) ? describe.skip:
describe("test fundme contrace",async function () {
    let fundMe
    let firstAccount
    let mockV3Aggregatoraddres
    let secondAccount
    let fundMeSecondAccount
    beforeEach(async function () {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        secondAccount = (await getNamedAccounts()).secondAccount
        const fundMeDeployMent = await deployments.get("FundMe")
        mockV3Aggregatoraddres = (await deployments.get("MockV3Aggregator")).address
        fundMe              = await ethers.getContractAt("FundMe",fundMeDeployMent.address)   
        fundMeSecondAccount = await ethers.getContractAt("FundMe", secondAccount) 
    })


    it("test if the owner is mag.sender",async function () {
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.owner()),firstAccount)
    })
    
    it("test if the datafeed is assingned correctly",async function () {
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.dataFeed()),mockV3Aggregatoraddres)
    })



    it("window closed , value grater than minimum , fund faild",
        async function () {
            // make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()
            // value grater than minimum
            await expect(fundMe.fund({value: ethers.parseEther("0.1")})).to.be.revertedWith("window is closed ")
        }
    )


    it("window open , value grater than minimum , fund faild",
        async function () {
            await expect(fundMe.fund({value: ethers.parseEther("0.01")})).to.be.revertedWith("Send more ETH")
        }
    )



    it("window open , value grater than minimum , fund sucess",
        async function () {
            await fundMe.fund({value: ethers.parseEther("0.5")})
            const balance = await fundMe.funderToAmounts(firstAccount)
            await expect(balance).to.equal(ethers.parseEther("0.5"))
        
    })

    it("not onwer , window closed , target reachrd, getFund failed",
        async function() {

            await fundMe.fund({value: ethers.parseEther("1")})
            // make sure the window is closed
            await helpers.time.increase(200)
            await helpers.mine()
            await expect(fundMeSecondAccount.getFund()).to.be.revertedWith("This function can only be called by owner")

        }
    )


    it ("window open target reached",
        async function () {
            await fundMe.fund({value: ethers.parseEther("1")})
            await expect(fundMe.getFund()).to.be.revertedWith("window is no closed ")
            
        }
    )

    it("windoe close,target not reached,getFund failed",async function () {
        await fundMe.fund({value: ethers.parseEther("0.1")})
        await helpers.time.increase(200)
        await helpers.mine()

        await expect(fundMe.getFund()).to.be.revertedWith("Target is not reachrd")
       
    })

    it("windoe close,target reached,getFund success",async function () {
        await fundMe.fund({value: ethers.parseEther("1")})
        await helpers.time.increase(200)
        await helpers.mine()

        await expect(fundMe.getFund()).to.emit(fundMe,"FundWithdrawByOwner").withArgs(ethers.parseEther("1"))
       
    })

    it("window open ,tatget not reached funder has balance",async function () {
        await fundMe.fund({value: ethers.parseEther("0.1")})
        // await helpers.time.increase(200)
        // await helpers.mine()

        await expect(fundMe.refund()).to.be.revertedWith("window is no closed ")
       
       
    })


    it("window open ,tatget not reached funder has balance",async function () {
        await fundMe.fund({value: ethers.parseEther("1")})
        await helpers.time.increase(200)
        await helpers.mine()

        await expect(fundMe.refund()).to.be.revertedWith("Target is not reachrd")
       
       
    })


    it("window open ,tatget not reached funder has balance",async function () {
        await fundMe.fund({value: ethers.parseEther("0.1")})
        await helpers.time.increase(200)
        await helpers.mine()

        await expect(fundMeSecondAccount.refund()).to.be.revertedWith("there is no fund for you")
       
       
    })


    it("window open ,tatget reached funder has balance",async function () {
        await fundMe.fund({value: ethers.parseEther("0.1")})
        await helpers.time.increase(200)
        await helpers.mine()

        await expect(fundMe.refund()).to.emit(fundMe,"RefundByFunder").withArgs(firstAccount,ethers.parseEther("0.1"))
       
       
    })


})