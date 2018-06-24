pragma solidity ^0.4.2;

contract DappToken {
  
  string public symbol = "DAPP";
  string public name = "DApp Token";
  string public standard = "DApp Token v1.0";
  uint256 public totalSupply;
  
  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );

  // mapping ower to number of token
  mapping(address => uint256) public balanceOf;
  
  // constructor
  constructor (uint256 _initialSupply) public {
    balanceOf[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
  }

  function transfer(address _to, uint256 _value) public returns (bool success) {
    require(balanceOf[msg.sender] >= _value);
    
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;

    // emit the event
    Transfer(msg.sender,_to,_value);

    return true;

  }
}
