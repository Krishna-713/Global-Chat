// import { Box, Button, Tooltip, Text, Menu,MenuButton,BellIcon } from "@chakra-ui/react";
// import React, { useState } from "react";
// import {ChevronDownIcon} from "@chakra-ui/icons";
import { Button, Spinner } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import ChatLoading from "../ChatLoading";
// import { Spinner } from "@chakra-ui/spinner";
// import NotificationBadge from "react-notification-badge";
// import { Effect } from "react-notification-badge";
// import { getSender } from "../../config/ChatLogics";
import UserListItem from "../UserAvator/UserListItem";
import { ChatState } from "../../Context/chatProvider";
import ProfileModal from "./ProfileModal";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingChat, setloadingChat] = useState(false);
  const {user , setSelectedChat,chats,setChats}= ChatState();

//   const { user } = ChatState();// check

  
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const logouthandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const toast=useToast();
  const handleSearch = async() => {
    

    if(!search){
        toast({
            title:"Please Enter something in Search",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"top-left",
        });
        return;
    }
    try {
        setloading(true)

        const config ={
            headers:{
                Authorization:`Bearer ${user.token}`,
            },
        };

          const {data} = await axios.get(`/api/user?search=${search}`,config);
          // console.log(search);
          console.log("searching for:", search);
          const response = await axios.get(`/api/user?search=${search}`, config);
          console.log("response:", response.data);
        
        setloading(false);
        setSearchResult(data);
    } catch (error) {
        console.log("Error:", error); 
        toast({
            title:"Error Occured!",
            description:"Failed to Load the search Result",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom-left",
        })
        }
  };
  const accessChat= async(userId) =>{
    try {
        setloadingChat(true);
        const config ={
            headers:{
                "Content-type":"application/json",
                Authorization:`Bearer ${user.token}`,
            },
        };

        const {data} = await axios.post('/api/chat',{userId},config);
        if(!chats.find((c) => c._id === data._id)) setChats([data,...chats]);
        setSelectedChat(data);
        console.log("Chat selected:", data);
        setloadingChat(false);
        onClose();

    } catch (error) {
        toast({
            title:"Error Fetching the Chat!",
            description:error.message,
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom-left",
        });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg={"white"}
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        <Tooltip loabel="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            {/* <i class="fa-sharp fa-solid fa-magnifying-glass"></i> */}
            <i class="fas fa-search"></i>

            <Text display={{ base: "none", md: "flex" }} px={"4"}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          Global Chat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            {/* <MenuList>
              <MenuItem></MenuItem>
            </MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logouthandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (<ChatLoading/>  )
            : (
                searchResult?.map((user) => (
                    <UserListItem
                    key ={user._id}
                    user={user}
                    handleFunction={()=> accessChat(user._id)}/>
                  )
                  )
              )
            }
            {loadingChat && <Spinner ml="auto" display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default SideDrawer;
