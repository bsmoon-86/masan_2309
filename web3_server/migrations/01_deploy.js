const user = artifacts.require("users")

module.exports = function(deployer){
    deployer.deploy(user)
    .then(function(){
        console.log('Contract deploy')
    })
}