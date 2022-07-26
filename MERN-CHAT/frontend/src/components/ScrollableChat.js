import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  fileSize
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import Image from './Image';
import { useState } from "react";



const ScrollableChat = ({ messages }) => {
  const [imageSrc, setImageSrc] = useState("");

  const { user } = ChatState();
  // <Image/>
  return (
    <ScrollableFeed>
        {/* <div>{user.pic}</div> */}
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
            
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            {/* {(fileSize(messages)) (
              <img src={m.content} />
            )} */}
            {m.content && <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,

              }}

            >
             {/* if(m.content.lengt &gt; 3000)
              {
                <img src={`${m.content}`} />

              }
                */}
              {m.content.length > 3000 ? <img src={`${m.content}`} /> : m.content }
             
            </span>}
           {/* {m.files && <img src={`${m.files}`}/>} */}
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;