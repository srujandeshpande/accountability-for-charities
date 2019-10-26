pragma solidity ^0.5.0;

contract Adoption {
  address[16] public adopters;
  // Adopting a pet
function adopt(uint petId) public returns (uint) {
  require(petId >= 0 && petId <= 15);

  adopters[petId] = msg.sender;

  return petId;
}
// Retrieving the adopters
function getAdopters() public view returns (address[16] memory) {
  return adopters;
}

function withdraw() public {
    msg.sender.transfer(address(this).balance);
}

function deposit(uint256 amount) payable public {
    require(msg.value == amount);
    // nothing else to do!
}

function getBalance() public view returns (uint256) {
    return address(this).balance;
}

}
