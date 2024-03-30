import { ENSInfo, Message } from "../interfaces";

class MessageController {

    globalMessages: Message[] = [];

    constructor(_globalMeessages: Message[]) {
        this.globalMessages = _globalMeessages;
    }
    extractMessages(selectedChat: ENSInfo | null, setMessages: (msgs: Message[]) => void) {
        // let msgs:Message[] = [];
        if (selectedChat) {
            const msgs = this.globalMessages.filter(
                (ft) =>
                    ft.from.toString() === selectedChat.address_.toString() ||
                    ft.to.toString() === selectedChat.address_.toString()
            );
            console.log(msgs);
            setMessages(msgs);
        }

    }


    extractChats(address: string | undefined, chats: ENSInfo[], setMyChats: (_chats: ENSInfo[]) => void) {
        let ids: string[] = [];
        for (let i = 0; i < this.globalMessages.length; i++) {
            const element = this.globalMessages[i];

            if (element.from.toString() === address?.toString()) {
                if (!ids.includes(element.to.toString())) {
                    ids.push(element.to.toString());
                }
            } else {
                if (!ids.includes(element.from.toString())) {
                    ids.push(element.from.toString());
                }
            }
        }

        for (let i = 0; i < ids.length; i++) {
            const element = ids[i];
            // console.log(chats);
            const find = chats.find(
                (fd) => fd.address_?.toString() === element.toString()
            );
            // console.log(find);
            if (find) {
                setMyChats([find]);
            }
        }
    }
}


export default MessageController