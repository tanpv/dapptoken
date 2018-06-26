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
  });

 
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
    });
  });


  it('approves tokens for delegated transfer', function(){
    return DappToken.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.approve.call(accounts[1], 100)
    }).then(function(success){
      assert.equal(success, true, 'it return true')
      return tokenInstance.approve(accounts[1], 100, {from: accounts[0]});
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1, 'trigger one event');
      return tokenInstance.allowance(accounts[0], accounts[1]);
    }).then(function(allowance){
      assert.equal(allowance.toNumber(), 100, 'stores the allowance for deledated transfer')
    });
  });


  it('handles delegated token transfers', function(){
    return DappToken.deployed().then(function(instance){
      tokenInstance = instance;
      fromAccount = accounts[2];
      toAccount = accounts[3];
      spendingAccount = accounts[4];
      // transfer some token
      return tokenInstance.transfer(fromAccount, 100, {from: accounts[0]});
    }).then(function(receipt){
      // approve
      return tokenInstance.approve(spendingAccount, 10, {from: fromAccount});
    }).then(function(receipt){
      return tokenInstance.transferFrom(fromAccount, toAccount, 9999, {from: spendingAccount});
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf('revert') >= 0, 'transfer too much');
      return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount});
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf('revert') >= 0, 'transfer could not larger then allow');
      return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount});
    }).then(function(success){
      assert.equal(success, true);
      return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});
    }).then(function(receipt){
      assert.equal(receipt.logs.length,1,'trigger one event');
      return tokenInstance.balanceOf(fromAccount);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 90, 'reduce of account');
      return tokenInstance.balanceOf(toAccount);
    }).then(function(balance){
      assert.equal(balance.toNumber(),10, 'increase of account');
      return tokenInstance.allowance(fromAccount, spendingAccount);
    }).then(function(allow){
      assert.equal(allow, 0, 'reduce of allowance');
    });
  });

  
});

