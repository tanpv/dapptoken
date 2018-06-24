var DappToken = artifacts.require("./DappToken.sol");

contract('DappToken', function(accounts){


  it('initializes the contract with the correct values', function(){
    return DappToken.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.name();
    }).then(function(name){
      assert.equal(name,'DApp Token', 'has the correct name')
      return tokenInstance.symbol();
    }).then(function(symbol){
      assert.equal(symbol,"DAPP", 'has the correct symbol');
      return tokenInstance.standard();
    }).then(function(standard){
      assert.equal(standard,"DApp Token v1.0",'has the correct standard')
    });
  })

 
  it('sets the total supply upon deployment', function(){    
    return DappToken.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.totalSupply();
      }).then(function(totalSupply){
        assert.equal(totalSupply, 1000000, 'set total supply to 1000000');
        return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
          assert.equal(adminBalance.toNumber(), 1000000, 'transfer all to admin at beginning');
    });
  });

  it('transfers token ownership', function(){
      return DappToken.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.transfer.call(accounts[1],99999999);
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf('revert')>=0,'error message must contain revert');
      return tokenInstance.transfer(accounts[1], 250000, {from:accounts[0]});
    }).then(function(receipt){

      assert.equal(receipt.logs.length,1,'triggers one event');

      return tokenInstance.balanceOf(accounts[1]);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account');
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 750000, 'reduce by transfer')
      return tokenInstance.transfer.call(accounts[1], 250000, {from:accounts[0]});
    }).then(function(success){
      assert.equal(success, true)
    })

  });

});

