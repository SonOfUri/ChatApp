// Import React and Message interface
import React from "react";
import { Message } from "../interfaces";

// Import useWeb3ModalAccount hook from @web3modal/ethers/react
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

// Define a Function Component (FC) with Message interface as its props. Destructure 'message' and 'from' from the props.
const ChatMessage: React.FC<Message> = ({ message, from }) => {
    // Call the useWeb3ModalAccount hook and de-structure the address from its return value.
    const { address } = useWeb3ModalAccount();

    // Check if the address returned by the hook matches the 'from' prop, in order to determine if the sending user is the current user.
    const isUser = address?.toString() === from.toString();

    // Use a ternary operator to apply different styles based on whether the message is sent by the current user or not.
    // Return a JSX div element containing a span element, which displays the 'message' prop.
    return (
        <div className={`text-sm py-1 ${isUser ? "text-right" : "text-left"}`}>
      <span
          className={`px-2 py-1 rounded-lg inline-block ${
              isUser ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
      >
        {message}
      </span>
        </div>
    );
};

// Export the ChatMessage component as the default export of this module.
export default ChatMessage;