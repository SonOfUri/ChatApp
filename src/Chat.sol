// SPDX-License-Identifier: SEE LICENSE IN LICENSE
// This is the license identifier. It is used to specify the license type.

pragma solidity ^0.8.8;
// Solidity version pragma statement. It tells the compiler that
// the code is written for the specified version of the Solidity language.

import "./interfaces/IENS.sol";
// Import statement: we are including the 'IENS.sol' file which resides in the 'interfaces' directory.

contract Chat {
    // Defines a contract named Chat.
    IENS ens;
    // Declares a state variable of the type IENS. This could represent the Ethereum Name Service instance.

    mapping(address => uint) public msgCount;
    // A public state variable representing a mapping, which associates an Ethereum address
    // with the number of messages linked to it.

    struct Message {
        // A struct representing a Chat message.
        address from;
        // The address of the sender of the message.

        address to;
        // The address of the receiver of the message.

        string message;
        // The actual content of the message.
    }

    Message[] messages;
    // An array of 'Message' structs which can hold multiple Message instances.

    constructor(address _ensAddress) {
        // Constructor function: this function is used to initialize the Chat contract.
        ens = IENS(_ensAddress);
        // It assigns the address passed as argument while deploying, to the 'ens' state variable.
    }

    function sendMessage(string calldata _msg, address _to) external {
        // A function that is external can only be called from outside the contract.
        // This function allows a user to send messages.
        msgCount[msg.sender] += 1;
        // Increments the message count for the sender address in the msgCount mapping.

        msgCount[_to] += 1;
        // Same for the recipient's address.

        messages.push(Message({from: msg.sender, to: _to, message: _msg}));
        // The function creates a new Message and adds it to the 'messages' array.
    }

    function getUserMessages() external view returns (Message[] memory) {
        // A function that retrieves all messages related to the address calling the function.
        Message[] memory l = new Message[](msgCount[msg.sender]);
        // It initializes a new dynamic Message array with a size equals to the number
        // of messages related to the sender.

        uint _count = 0;
        // It initializes a counter to 0.

        for (uint i = 0; i < messages.length; i++) {
            // It iterates over the messages array.

            if (
                messages[i].from == msg.sender || messages[i].to == msg.sender
            ) {
                // It checks if the current message is either sent from or sent to the caller.

                l[_count] = messages[i];
                // If it is, adds the message to the temporary array.

                _count++;
                // And increments the counter.
            }
        }
        return l;
        // It returns the temporary array.
    }
}