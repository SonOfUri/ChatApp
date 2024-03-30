// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {ChatApp} from "../src/ChatApp.sol";

contract ChatAppTest is Test {
    ChatApp public chatapp;

    function setUp() public {
        chatapp = new ChatApp();
    }

    function testRegisterUsername() public {
        string memory username = "alice.sou";
        vm.prank(address(1));
        chatapp.registerUsername(username);

        assertEq(chatapp.getAddressByUsername(username), address(1));
        assertEq(chatapp.getUsernameByAddress(address(1)), username);
    }

    function testRegisterUsernameWithoutSouSuffixFails() public {
        string memory username = "alice";
        vm.expectRevert("Username must end with '.sou'");
        vm.prank(address(1));
        chatapp.registerUsername(username);
    }

//    function testSendEther() public {
//        string memory senderUsername = "alice.sou";
//        string memory receiverUsername = "bob.sou";
//
//        // Register both users
//        vm.prank(address(1));
//        chatapp.registerUsername(senderUsername);
//        vm.prank(address(2));
//        chatapp.registerUsername(receiverUsername);
//
//        // Send Ether from Alice to Bob
//        vm.prank(address(1));
////        chatapp.sendEther{value: 1 ether}(receiverUsername);
////        assertEq(address(2).balance, 1 ether);
//
//         uint256 balance = address(1).balance;
//
//        console.log("balance", balance);
//
//
//    }

    function testSendEther() public {
        string memory senderUsername = "alice.sou";
        string memory receiverUsername = "bob.sou";

        // Register sender
        vm.prank(address(1));
        chatapp.registerUsername(senderUsername);

        // Register receiver
        vm.prank(address(2));
        chatapp.registerUsername(receiverUsername);

        // Ensure the sender has enough Ether
        vm.deal(address(1), 10 ether);

        // Check the sender's balance before the transaction for assertion
        uint senderBalanceBefore = address(1).balance;

        // Send Ether from sender to receiver
        vm.prank(address(1));
        chatapp.sendEther{value: 1 ether}(receiverUsername);
//        chatapp.sendEther(receiverUsername, { value: 1 ether} );

        // Check the receiver's balance to ensure they received the Ether
        assertEq(address(2).balance, 1 ether);

        // Optionally, check the sender's balance to ensure it was deducted
        uint senderBalanceAfter = address(1).balance;
        assertEq(senderBalanceBefore - senderBalanceAfter, 1 ether);

                 uint256 balance = address(1).balance;
        console.log("balance", balance);
    }


    function testSendMessage() public {
        string memory senderUsername = "alice.sou";
        string memory receiverUsername = "bob.sou";
        string memory message = "Hello, Bob!";

        // Register both users
        vm.prank(address(1));
        chatapp.registerUsername(senderUsername);
        vm.prank(address(2));
        chatapp.registerUsername(receiverUsername);

        // Send a message from Alice to Bob
        vm.prank(address(1));
        chatapp.sendMessage(receiverUsername, message);

        // Check the event to confirm the message was sent (use the logs)
    }


}
