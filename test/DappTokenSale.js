var DappTokenSale = artifacts.require("./DappTokenSale.sol");
var DappToken = artifacts.require("./DappToken.sol");

contract('DappTokenSale', function(accounts){
  var tokenSaleInstance;
  var tokenInstance;
  var admin = accounts[0];
  var buyer = accounts[1];
  const tokenPrice = 1000000000000000;
  var tokensAvailable = 750000;
  var numberOfTokens;

  it('init contract with correct values', function(){
    return DappTokenSale.deployed().then(function(instance){
      tokenSaleInstance = instance;
      return tokenSaleInstance.address;
    }).then(function(address){
      assert.notEqual(address, 0x0, 'has contract address');
      return tokenSaleInstance.tokenContract();
    }).then(function(address){
      assert.notEqual(address, 0x0, 'has token contract address');
      return tokenSaleInstance.tokenPrice();
    }).then(function(price){
      assert.equal(price, tokenPrice, 'token price is correct');
    });
  });


  it('testing for buy token', function(){
    return DappToken.deployed().then(function(instance){
      tokenInstance = instance;
      return DappTokenSale.deployed();
    }).then(function(instance){
      tokenSaleInstance = instance;
      // transfer token from token instance to token sale instance
      return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from:admin});
    }).then(function(receipt){

      numberOfTokens = 10;
      let value = numberOfTokens * tokenPrice;
      return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: value});
    
    }).then(function(receipt){

      assert.equal(receipt.logs.length, 1, 'trigger one event');
      return tokenSaleInstance.tokensSold();

    }).then(function(amount){

      assert.equal(amount.toNumber(), numberOfTokens, 'increments of token sold');
      return tokenInstance.balanceOf(tokenSaleInstance.address);

    }).then(function(balance){

      assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
      return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value:1});

    }).then(assert.fail).catch(function(error){
      
      assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of token in wei');
      return tokenSaleInstance.buyTokens(800000, {from: buyer, value: numberOfTokens * tokenPrice});

    }).then(assert.fail).catch(function(error){

      assert(error.message.indexOf('revert') >=0, 'too large of buy number');

    });
  });

  it('ends token sale', function(){
    return DappToken.deployed().then(function(instance){
      tokenInstance = instance;
      return DappTokenSale.deployed();
    }).then(function(instance){
      tokenSaleInstance = instance;

      return tokenSaleInstance.endSale({from:buyer});
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf('revert') >= 0, 'only admin can end sale');
      return tokenSaleInstance.endSale({from:admin});
    }).then(function(receipt){
      return tokenInstance.balanceOf(admin);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 999990, 'return all unsold token to admin');
    })
  });

});