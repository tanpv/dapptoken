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

  event Approval(
    address indexed _owner,
    address indexed _sender,
    uint256 _value
  );

  // mapping ower to number of token
  mapping(address => uint256) public balanceOf;
  // allowance
  mapping(address => mapping(address => uint256)) public allowance;
  
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
    emit Transfer(msg.sender,_to,_value);

    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success) {
    // msg.sender : people trigger this function and approve to _spender spend some token from his balance
    // _spender   : people that allow to spend
    // _value     : number of token approve by _spender

    // update allowance
    allowance[msg.sender][_spender] = _value;
    // emit approval event
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
    // _from      : people that approve msg.sender to spend
    // msg.sender : people that allowed to spend some token from _from, this people will trigger this function
    // _to        : people will receive token if transfer successfully
    // _value     : number of token which will be transfer

    // transfer value should smaller than balance of from account
    require(_value <= balanceOf[_from]);

    // transfer value should smaller than allow number to transfer value
    require(_value <= allowance[_from][msg.sender]);

    // emit transfer event
    emit Transfer(_from, _to, _value);
    
    // update balance for _from and _to account
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;

    // update allowance for _from account
    allowance[_from][msg.sender] -= _value;

    return true; 
  }
}



