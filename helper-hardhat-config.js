const DECIMAL = 8
const INITIAL_ANSWER=300000000000
const devlopmentChains = ["hardhat","local"]
const networkConfig = {
    11155111:{
        ethUsdDataFeed:"0x694AA1769357215DE4FAC081bf1f309aDC325306"
    },
    97:{
        ethUsdDataFeed : "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"
    }
}
module.exports = {
    DECIMAL,
    INITIAL_ANSWER,
    devlopmentChains,
    networkConfig
}