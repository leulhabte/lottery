// SPDX-License-Identifier: 0.8.0
pragma solidity ^0.8.0;

contract AddisLottery {
    event LogPLayers(Player player);

    bool suspend;
    bool rollingIn;
    address public manager;
    uint public bettingValue;
    struct Player {
        address payable account;
        uint timestamp;
    }

    Player[] public players;

    constructor (uint newbettingValue) {
        rollingIn = false;
        suspend = false;
        manager = msg.sender;
        bettingValue = newbettingValue;
    }

    // Place bet
    function bet() public payable returns(Player memory){
        require(msg.value == bettingValue * (1 ether));
        require(!suspend);
        Player memory newPlayer = Player({
            account: payable(msg.sender),
            timestamp: block.timestamp
        });

        players.push(newPlayer);
        rollingIn = true;

        emit LogPLayers(newPlayer);
        return newPlayer;
    }


    // Generate Random number
    function random() private view returns(uint){
        uint rand = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, manager)));
        return rand % players.length;
    }

    // Pick winner
    function pickWinner(uint newBettingValue) public payable returns(address){
        require(msg.sender == manager);
        require(rollingIn);
        uint rand = random();
        suspend = true;
        address winner = players[rand].account;

        (bool sent, ) = winner.call{value: address(this).balance}("");
        require(sent, "Failed to send prize to winner");

        delete players;
        bettingValue = newBettingValue;
        rollingIn = false;
        suspend = false;

        return winner;
    }

    // Get Lottery Balance
    function getBalance() public view returns(uint){
        return address(this).balance;
    }
}