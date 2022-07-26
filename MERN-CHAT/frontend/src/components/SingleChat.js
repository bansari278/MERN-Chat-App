import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Text } from '@chakra-ui/layout';
import { IconButton, Button } from '@chakra-ui/button';
import { getSender, getSenderFull } from '../config/ChatLogics';
import { ChatState } from '../context/ChatProvider';
import ProfileModal from './miscellaneous/ProfileModal';
import React, { useState, useEffect, useRef } from 'react';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import { Spinner, FormControl, Input, useToast } from '@chakra-ui/react';
import axios from 'axios';
import './styles.css';
import BlockUi from "react-block-ui"
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import emojiIcon from './icons/emojiIcon.png';
import useOutsideClick from "./hooks/useOutsideClick";
import attachIcon from './icons/attachIcon.png';
// import Image from "./image";



const ENDPOINT = "http://localhost:9000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [file, setFile] = useState();

  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  // const [showEmoji, setShowEmoji] = useState(false);
  const toast = useToast();
  const socketRef = useRef();

  const { showEmoji, setShowEmoji, ref } = useOutsideClick(false)


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleEmojiShow = () => { setShowEmoji((v) => !v); };

  const handleEmojiSelect = (e) => {
    setNewMessage((newMessage) => (newMessage += e.native))
  }



  const fetchMessages = async () => {

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      // console.log(messages);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

    }
  };

  const sendMessage = async (event) => {


    if (event.key === "Enter" && newMessage) {
      console.log(newMessage);
      socket.emit("stop typing", selectedChat._id);
      //   socket.emit("stop typing", selectedChat._id);
      // console.log("hello");

      try {
        const config = {
          headers: {
            // "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          `/api/message`,
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        setNewMessage("");
        // console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // console.log(notification,"...............");

  useEffect(() => {
    socket.on("message received", (newMessageRecieved) => {
      // console.log(newMessageRecieved);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //notifications
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  function selectFile(e) {
    if (typeof e.target.files[0] !== 'undefined') {

      const filesList = e.target.files;
      if (filesList) {
        convertToBase64(filesList[0]);
      }
      setFile(e.target.files[0]);
    } else {
      return null
    }
  }

  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = function () {
      const convertedFile = reader.result;
      console.log(convertedFile);
      setNewMessage(convertedFile);

    }
  }


  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const [blocking, setBlocking] = useState(false)
  function toggleBlocking() {
    // console.log(selectedChat)
    // const id = selectedChat?._id
    console.log(blocking);

    setBlocking(!blocking);

  }
  return (
    <>{
      selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            >
            </IconButton>
            <Button onClick={toggleBlocking} color="primary">Toggle Block</Button>
            {!selectedChat.isGroupChat ? (
              <>{getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}

                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )
            }
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">

                <ScrollableChat messages={messages} />
              </div>
            )}
            {showEmoji && (
              <div ref={ref}>
                <Picker
                  onSelect={handleEmojiSelect}
                  emojiSize={20} />
              </div>
            )}
            <BlockUi blocking={blocking} >
              <FormControl
                onKeyDown={sendMessage}
                id="first-name"
                isRequired
                mt={3}

              >
                {istyping ? (
                  <div>
                    <Lottie
                      options={defaultOptions}
                      // height={50}
                      width={70}
                      style={{ marginBottom: 15, marginLeft: 0 }}
                    />
                  </div>
                ) : (
                  <></>
                )}


                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                  position="absolute"
                />
                <Button
                  className="sendButton"
                  type="button"
                  onClick={handleEmojiShow}
                  position="relative"
                >
                  <img
                    width="40px"
                    src={emojiIcon}
                    alt="uploadImage" />
                </Button>
                <label htmlFor="file-input">

                  <div className="uploadButton">
                    <img
                      className="uploadImage"
                      src={attachIcon}
                      alt="uploadImage" />
                  </div>
                </label>
                <input
                  selectFile={selectFile}
                  id="file-input"
                  className="input"
                  onChange={selectFile}
                  type="file"
                />
              </FormControl>
            </BlockUi>
          </Box>

        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="25px" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )
    }
    </>

  );

};

export default SingleChat;