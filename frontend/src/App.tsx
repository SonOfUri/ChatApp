import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./components/Message";
import ChatInput from "./components/Input";
import { ENSInfo, Message } from "./interfaces";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import useGetMessages from "./hooks/useGetMessages";
import { Controller } from "./controllers/Controller";
import useGetENS from "./hooks/useGetENS";
import MessageController from "./controllers/MessagesController";

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [myChats, setMyChats] = useState<ENSInfo[]>([]);
  const { walletProvider } = useWeb3ModalProvider();
  const { isConnected, chainId, address } = useWeb3ModalAccount();
  const ref = useRef<HTMLInputElement>(null);
  const [valid, setValid] = useState(false);
  const [loading, userENS] = useGetENS(walletProvider, isConnected, valid);

  const { globalMessages, chats } = useGetMessages(
    walletProvider,
    isConnected,
    userENS !== null
  );
  const controller = new Controller(chainId, walletProvider);
  const messageController = new MessageController(globalMessages);




  const [search, setSearch] = useState<ENSInfo | null>(null);

  const addMessage = (text: string) => {
    const newMessage: Message = {
      from: address?.toString() ?? "",
      to: selectedChat?.address_ ?? "",
      message: text,
      userProfile: selectedChat!,
    };
    setMessages([...messages, newMessage]);
    controller.sendMessage(text, selectedChat?.address_.toString() ?? "");
  };
  const [registering, setRegistering] = useState<boolean>(false);
  const ensRef = useRef<HTMLInputElement>(null);
  const [fileImg, setFileImg] = useState<any>();
  const [selectedChat, setSelectedChat] = useState<ENSInfo | null>(null);
  const [cachedImageHash, setCachedImgHash] = useState<string | null>(null);
  const sendFileToIPFS = async () => {
    if (registering) return;
    if (fileImg && ensRef.current?.value) {
      try {
        if (cachedImageHash) {
          const tx = await controller.registerENS(
            cachedImageHash,
            ensRef.current.value.trim()
          );

          if (tx) {
            setCachedImgHash(null);
          } else {
            setCachedImgHash(cachedImageHash);
          }

          return;
        }
        setRegistering(true);
        const formData = new FormData();
        formData.append("file", fileImg);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `${import.meta.env.VITE_API_KEY}`,
            pinata_secret_api_key: import.meta.env.VITE_SECRET_KEY,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        const tx = await controller.registerENS(
          ImgHash,
          ensRef.current.value.trim()
        );

        if (tx) {
          setCachedImgHash(null);
          setValid(true);
        } else {
          setCachedImgHash(ImgHash);
        }
        setRegistering(false);

        // console.log(ImgHash);
        //Take a look at your Pinata Pinned section, you will see a new file added to you list.
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
      }
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    setMessages([]);
   messageController. extractMessages(selectedChat,(msgs:Message[]) => setMessages(msgs));
  }, [selectedChat]);

  useEffect(() => {
   messageController.extractChats(address?.toString(),chats,(_chats) => setMyChats([...chats,..._chats]));
  }, [globalMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isConnected) {
    return (
      <div className="h-screen">
        <nav className="py-3 shadow shadow-[rgba(255,255,255,.1)]">
          <div className="flex items-center justify-between container">
            <h1 className=" madimi-one-regular text-3xl">SOU Chat</h1>
            <w3m-button />
          </div>
        </nav>
        {loading ? (
          <h1>loading</h1>
        ) : userENS ? (
          <div className="max-w-3xl mx-auto flex mt-7">
            <div className="w-1/4 h-[82vh] overflow-y-auto bg-gray-100 shadow-md  p-4 mr-4">
              <h2 className="text-lg font-bold mb-4">Contact List</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const result = await controller.searchENS(
                    ref.current?.value.trim() ?? ""
                  );
                  if (result) {
                    setSearch(result);
                  }
                }}
              >
                <input
                  ref={ref}
                  type="text"
                  placeholder="Find Contacts..."
                  className="w-full border px-2 py-1 "
                  required
                />
              </form>
              <ul className="space-y-3 mt-5">
                {search ? (
                  <li
                    onClick={() => setSelectedChat(search)}
                    className="py-1 border-b-[1px] pb-2 flex items-center gap-2"
                  >
                    <img
                      src={search.avatar}
                      className="w-8 h-8"
                      alt=""
                    />
                    <p>{search.name}</p>
                  </li>
                ) : null}
                {myChats.map((chat) => (
                  <li
                    onClick={() => setSelectedChat(chat)}
                    className="py-1 border-b-[1px] pb-2 flex items-center gap-2"
                  >
                    <img
                      src={chat.avatar}
                      className="w-8 h-8"
                      alt=""
                    />
                    <p>{chat.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-3/4 bg-gray-100 h-[82vh] shadow-md  p-4">
              {selectedChat ? (
                <div className="">
                  <div className="flex items-center mb-4 gap-3">
                    <img
                      src={selectedChat.avatar}
                      className="h-10 w-10"
                      alt=""
                    />
                    <h2 className="text-lg font-bold">{selectedChat.name}</h2>
                  </div>
                  <div
                    ref={messagesEndRef}
                    className="mb-4  h-[60vh] overflow-y-auto"
                  >
                    {messages.map((message, index) => (
                      <ChatMessage
                        key={index}
                        message={message.message}
                        from={message.from}
                        to={message.to}
                        userProfile={message.userProfile}
                      />
                    ))}
                  </div>
                  <ChatInput addMessage={addMessage} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  SOU Chat
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className=" h-[80vh] w-full flex items-center justify-center ">
            <div className="w-1/2 bg-white shadow p-5">
              <h1 className="text-xl font-[600]">Register ENS</h1>
              <div className="flex mt-10 items-center justify-center">
                {/* <form></form> */}
                {fileImg ? (
                  <label
                    htmlFor="file"
                    className="h-32 cursor-pointer w-32 bg-gray-300"
                  >
                    <img
                      src={URL.createObjectURL(fileImg)}
                      className="w-full h-full"
                      alt=""
                    />
                  </label>
                ) : (
                  <label
                    htmlFor="file"
                    className="h-32 cursor-pointer w-32 bg-gray-300"
                  ></label>
                )}
              </div>
              <input
                ref={ensRef}
                type="text"
                placeholder="Name..."
                className="outline-none border-[1px] p-3 -lg mt-10 w-full"
                name=""
                id=""
              />
              <button
                disabled={registering}
                onClick={sendFileToIPFS}
                className="bg-blue-400 w-full p-3 text-white mt-10 "
              >
                {registering ? "Loading..." : "Register"}
              </button>
                  <input
                    placeholder="sdfsd"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    setFileImg(e.target.files[0]);
                  }
                  console.log("sdfs");
                }}
                className="w-0 h-0"
                name=""
                id="file"
              />
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <w3m-button />
      </div>
    );
  }
};

export default App;
