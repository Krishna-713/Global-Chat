import react, { useEffect, useState } from "react";
import { ChatState } from "../Context/chatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscllaneous/ProfileModal";
import { getSender, getSenderFull } from "../config/ChatLogics";
import UpdatedGroupChatModal from "./miscllaneous/UpdatGroupChatModal";
import axios from "axios";
import './styles.css';
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client';
import Lottie, { } from 'react-lottie'
import animationData from "../animations/typing.json";
const ENDPOINT ="http://localhost:5000";
var socket,selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [socketConnected,setSocketConnected]=useState(false);
  const [typing,setTyping] =useState(false);
  const [isTyping,setIsTyping]= useState(false);
  const defaultOptions ={
    loop:true,
    autoplay: true,
    animationData:animationData,
    rendererSettings:{
      preserveAspectRatio:"xMidYMid slice",
    },
  }
  
  const toast =useToast();

  const fetchMessages = async() =>{
    if(!selectedChat) return;

    try {
        const config = {
            headers: {
              "Content-Type" : "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          setLoading(true);
          const { data } = await axios.get(`/api/message/${selectedChat._id}`,
               config);
        console.log(messages);
        
        setMessages(data);
        setLoading(false);

        socket.emit('join chat',selectedChat._id);
    } catch (error) {
        toast({
            title:"Error Occured!",
            description:"Failed to send the Messages",
            status:"error",
            isClosable:true,
            duration:5000,
            position:"bottom"
        });
    }
  };
  useEffect(() =>{
    fetchMessages();

    selectedChatCompare=selectedChat;
  },[selectedChat]);

  useEffect(() =>{
    socket=io(ENDPOINT);
    socket.emit("setup",user);
    socket.on('connected',() =>setSocketConnected(true) );
    socket.on('typing' ,() => setIsTyping(true));
    socket.on('stop typing' ,() => setIsTyping(false));
    
  },[]);
  useEffect(() =>{
    socket.on('Message recieved',(newMessageRecieved) =>{
      if (!selectedChatCompare || selectedChatCompare._id !==  newMessageRecieved.chat._id ){
        // give notification
      }else{
        setMessages([...messages,newMessageRecieved]);
        // setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }

    });
  })

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit('stop typing',selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type" : "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post("/api/message",
            {
                content :newMessage,
                chatId:selectedChat._id,
            }, config);
        console.log(data);
        socket.emit('new message',data )
        setMessages([...messages,data]);
      } catch (error) {
        toast({
            title:"Error Occured!",
            description:"Failed to send the Messages",
            status:"error",
            isClosable:true,
            duration:5000,
            position:"bottom"
        });
      }
    }
  };

 
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    //Typing Indicator Logic

    if(!socketConnected)   return;
    if(!typing){
      setTyping(true);
      socket.emit('typing',selectedChat._id);
    }

    let lastTypingTime=new Date().getTime();
    var timerLength =3000;
    setTimeout(() =>{
      var timeNow= new Date().getTime();
      var timeDiff=timeNow-lastTypingTime;
      if(timeDiff >= timerLength && typing){
        socket.emit('stop typing',selectedChat._id);
        setTyping(false);
      }
    },timerLength)
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            display={"flex"}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work snas"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdatedGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h="100%"
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {/* Messages here */}
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignItems={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                {/* Messages   */}
                <ScrollableChat messages={messages} />
                </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ?<div><Lottie 
                width={70}
                options={defaultOptions}
                style={{marginBottom:15,marginLeft:0}}
                /></div> :(<></>) }
              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder="Enter a message.. "
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box    
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click on a user to start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};
export default SingleChat;
