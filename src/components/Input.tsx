// Import React and the useState hook
import React, { useState } from "react";

// Define the Props interface to type the addMessage function
interface Props {
  addMessage: (text: string) => void;
}

// Define a Function Component (FC) using the Props interface and de-structure addMessage from its props.
const ChatInput: React.FC<Props> = ({ addMessage }) => {
  // Define a state value 'text' and a function 'setText' to update it, using the useState hook. Initialize 'text' as an empty string.
  const [text, setText] = useState("");

  // Define a function to handle key press events in the input field.
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If the Enter key is pressed and the text value is not empty, call 'addMessage' with the current text value and clear the input field.
    if (e.key === "Enter" && text.trim() !== "") {
      addMessage(text);
      setText("");
    }
  };

  // Return a JSX input element. This element has a type, class, placeholder, value corresponding to the 'text' state,
  // an onChange event that captures the text input value on change, and an onKeyPress event that triggers 'handleKeyPress'.
  return (
      <input
          type="text"
          className="w-full border rounded p-2"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
      />
  );
};

// Export the ChatInput component as the default export of this module.
export default ChatInput;