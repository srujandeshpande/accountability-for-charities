pragma solidity ^0.5.0;

contract Adoption {
  address[16] public adopters;
  address[10] public adop0;
  uint dop0 = 0;

  // Adopting a pet
function adopt(uint petId) public returns (uint) {
  require(petId >= 0 && petId <= 15);

  adopters[petId] = msg.sender;
  if(petId == 0) {
    adop0[dop0%10] = adopters[petId];
  }

  return petId;
}
// Retrieving the adopters
function getAdopters() public view returns (address[16] memory) {
  return adopters;
}

function getChar0() public view returns (address[10] memory) {
  return adop0;
}

}
