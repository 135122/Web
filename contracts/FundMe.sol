// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
contract FundMe {
    mapping (address=>uint256) public funderToAmounts;
    uint256 MINIMUM_VALUE = 100 * 10 ** 18; // USD
    uint256 constant Target = 1000 * 10 ** 18;
    AggregatorV3Interface internal dataFeed;

    uint256 deploymentTimestamp;
    uint256 locktime;
    address erc20Adder;
    address public owner;
    bool public  getFundSucess;
    uint256 public w;
    uint256 public t;
    uint256 public o;
    uint256 public p;
    constructor(uint256 _locktime){
        dataFeed = AggregatorV3Interface(0x5fb1616F78dA7aFC9FF79e0371741a747D2a7F22);
        owner = msg.sender;
        deploymentTimestamp = block.timestamp;
        locktime = _locktime;
    } 

    function fund() external payable {
        require(block.timestamp - deploymentTimestamp < locktime,"window is closed ");
        require(convertEthToUsd(msg.value) >= MINIMUM_VALUE,"Send more ETH");
        funderToAmounts[msg.sender] = msg.value;
    }


    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    function convertEthToUsd(uint256 ethAmount) internal  returns(uint256) {

        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        o = ethPrice;
        p = ethAmount;
        return ethPrice*ethAmount/(10**16);
    }
    function getFund() external windowClosed onlyOwer{
        
        require(convertEthToUsd(address(this).balance) >= Target,"Target is not reachrd");
        w = convertEthToUsd(address(this).balance);
        t = Target;
        
        //payable(msg.sender).transfer(address(this).balance);
        // bool success = payable(msg.sender).send(address(this).balance);
        // require(success,"tx failed");
        bool sucess;
        (sucess,) = payable(msg.sender).call{value:address(this).balance}("");
        require(sucess,"transfer tx failed");
        getFundSucess = true; // flag
    }
    function transferOwnership(address newOwer) public onlyOwer{
        owner = newOwer;
    }

    function refund() external windowClosed {
        require(convertEthToUsd(address(this).balance) < Target,"Target is not reachrd");
        require(funderToAmounts[msg.sender] != 0,"there is no fund for you"); 
        bool sucess;
        (sucess,) = payable(msg.sender).call{value:funderToAmounts[msg.sender]}("");
        require(sucess,"transfer tx failed");
        funderToAmounts[msg.sender] = 0;

    }

    function setFunderToAmount(address funder, uint256 amountToUpdate)   external  {
            require(msg.sender == erc20Adder , "you do not have permission to call this function");
            funderToAmounts[funder] = amountToUpdate;
    }
    function setERC20Adder(address _erc20Addr) public onlyOwer{
        erc20Adder =_erc20Addr; 
    }
    modifier windowClosed() {
        require(block.timestamp - deploymentTimestamp >= locktime,"window is no closed ");
        _;
    }

    modifier onlyOwer(){
        require(msg.sender == owner,"This function can only be called by owner");
        _;
    }
}