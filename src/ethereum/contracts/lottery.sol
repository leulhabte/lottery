// SPDX-License-Identifier: 0.8.0
pragma solidity ^0.8.0;

contract AddisLottery {
    event LogPlayers(Player player);
    event LogWinner(address winner);

    bool suspend;
    bool rollingIn;
    bool locked;

    address public manager;
    uint public bettingValue;

    struct Player {
        address payable account;
        uint timestamp;
    }

    Player[] public players;

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    } 

    constructor (uint newbettingValue) payable {
        rollingIn = false;
        suspend = false;
        manager = msg.sender;
        bettingValue = newbettingValue;
    }

    // Place bet
    function bet() external payable returns(Player memory){
        require(msg.value == bettingValue, "Invalid amount");
        require(!suspend, "This transaction is suspended");
        Player memory newPlayer = Player({
            account: payable(msg.sender),
            timestamp: block.timestamp
        });

        players.push(newPlayer);
        rollingIn = true;

        emit LogPlayers(newPlayer);
        return newPlayer;
    }


    // Generate Random number
    function random() private view returns(uint){
        uint rand = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, manager)));
        return rand % players.length;
    }

    // Pick winner
    function pickWinner(uint newBettingValue, uint contractInterest, uint ownerInterest) external payable noReentrant returns(address){
        require(msg.sender == manager, "Invalid Access");

        if(!rollingIn){
            bettingValue = newBettingValue;
             return address(0);
        }

        uint rand = random();
        suspend = true;
        address winner = players[rand].account;

        if(winner != address(0x0) && address(this).balance > contractInterest){
        uint winnerValue = address(this).balance - contractInterest;
        (bool sent, ) = winner.call{value: winnerValue}("");
        require(sent, "Failed to send prize");

        if(contractInterest > ownerInterest){
        (bool sentToManager, ) = manager.call{value: ownerInterest}("");
        require(sentToManager, "Failed to send ");
        }

        bettingValue = newBettingValue;
        delete players;
        rollingIn = false;
        suspend = false;

        emit LogWinner(winner);
        }
        
        return winner;
    }

    // Get Lottery Balance
    function getBalance() external view returns(uint){
        return address(this).balance;
    }

    function getPlayers() external view returns(Player[] memory){
        return players;
    }
}