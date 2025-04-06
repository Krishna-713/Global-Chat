import { ChatState } from "../Context/chatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/miscllaneous/SideDrawer";
import Mychat from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";

const Chatpage =() =>{
    const {user}=ChatState();
    return (
    <div style={{width: "100%"}}>
        {user && <SideDrawer/>}
        <Box display="flex" justifyContent='space-between' w="100%" h='91.5vh' p='10px'>
            {user && <Mychat />} 
            {user && <ChatBox />}
        </Box>
    </div>) ;
    // return (
    //     <div>
    //       {chats.map((chat) => (
    //         <p key={chat._id}>{chat.chatName}</p>
    //       ))}
    //     </div>
    //   );
      
    
}
export default Chatpage;