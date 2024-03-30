// SPDX-License-Identifier: UNLICENSED
// SPDX-License-Identifier is a standard for machine-readable license identifiers.
// Here, it indicates that the code is proprietary and it's not licensed for reuse in other software.

pragma solidity ^0.8.13;
// This line specifies that the source code is written in Solidity version greater than 0.8.13.

contract ENS {
    // Defines a contract named 'ENS' (Ethereum Name Service).

    event Registered(address indexed _address, string indexed name);
    // This line defines an event that is emitted when a new name is registered in our name service.
    // Events allow the convenient usage of the EVM logging facilities,
    // which in turn can be used to “call” JavaScript callbacks in the user interface of a dapp.

    struct Info {
        // Struct type definition. It represents user-provided information associated with an Ethereum address.
        string avatar;
        // Avatar for the user, presumably an URL or a hash representing a picture

        string name;
        // The name chosen by the user for the association.

        address address_;
        // The associated Ethereum address
    }

    mapping(address => Info) addressToInfo;
    // State variable of type 'mapping'. It associates an Ethereum address to its Information.

    mapping(string => address) nameToAddress;
    //Another mapping that associates the user-chosen name to its Ethereum address.

    function register(string calldata avatar, string calldata name) external {
        // This function allows an Ethereum address to register its name.
        require(nameToAddress[name] == address(0), "NOT_AVAILABLE");
        // It first checks if the chosen name is already registered, using the 'require' function which
        // ensures a certain condition is met, or aborts the transaction.

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