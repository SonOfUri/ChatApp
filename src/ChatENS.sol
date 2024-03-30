// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.8;

contract ChatENS {

    // Chat part
    struct Message {
        address from;
        address to;
        string message;
    }

    Message[] messages;
    mapping(address => uint) msgCount;

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

    // ENS part
    struct Info {
        string avatar;
        string name;
        address address_;
    }

    event Registered(address indexed _address, string indexed name);
    // This line defines an event that is emitted when a new name is registered in our name service.
    // Events allow the convenient usage of the EVM logging facilities,
    // which in turn can be used to “call” JavaScript callbacks in the user interface of a dapp.

    mapping(address => Info) addressToInfo;
    mapping(string => address) nameToAddress;


    function register(string calldata avatar, string calldata name) external {
        // This function allows an Ethereum address to register its name.
        require(nameToAddress[name] == address(0), "NOT_AVAILABLE");
        // It first checks if the chosen name is already registered, using the 'require' function which
        // ensures a certain condition is met, or aborts the transaction.


        // Check that the username ends with ".sou"
        require(hasSouSuffix(name), "Username must end with '.sou'");

        nameToAddress[name] = msg.sender;
        // Then it adds a new entry in our 'nameToAddress' mapping associating the name to current sender's address.

        Info storage _newInfo = addressToInfo[msg.sender];
        // Creates a new instance of Info struct and

        _newInfo.avatar = avatar;
        _newInfo.name = name;
        _newInfo.address_ = msg.sender;
        // It sets each of its properties.

        emit Registered(msg.sender, name);
        // This line emits the 'Registered' event.
    }

    function hasSouSuffix(string memory str) internal pure returns (bool) {
        bytes memory strBytes = bytes(str);
        bytes memory suffix = bytes(".sou"); // The required suffix

        // Check if the username length is at least as long as the suffix
        if (strBytes.length < suffix.length) {
            return false;
        }

        // Compare each character of the suffix from the end of the username
        for (uint i = 0; i < suffix.length; i++) {
            if (strBytes[strBytes.length - i - 1] != suffix[suffix.length - i - 1]) {
                return false;
            }
        }

        // If all characters match, the username has the ".sou" suffix
        return true;
    }

    function getInfoFromAddress(
        address _address
    ) external view returns (Info memory) {
        // This is a 'view' function, that inspects the blockchain's state without modifying it.
        // It retrieves the information associated with a given Ethereum address.
        return addressToInfo[_address];
        // It returns the associated Info struct.
    }

    function getInfoFromName(
        string calldata _name
    ) external view returns (Info memory) {
        // This is another 'view' function that retrieves the information associated with a given name.
        return addressToInfo[nameToAddress[_name]];
        // It returns the associated Info struct.
    }
}