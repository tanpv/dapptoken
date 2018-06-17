var DappToken = artifacts.require("./DappToken.sol");

contract('DappToken', function(accounts){
  it('sets the total supply upon deployment', 
    function(){    
      return DappToken.deployed().then(function(instance){
          tokenInstance = instance;
          return tokenInstance.totalSupply();
        }).then(function(totalSupply){
           assert.equal(totalSupply, 1000000, 'set total supply to 1000000');
          })
  });
})