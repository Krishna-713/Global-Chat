import {
  IconButton,
  useDisclosure,
  Button,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
// import react from "react";
import  { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/chatProvider";
import UserBadgeItem from "../UserAvator/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvator/UserListItem";

const UpdatedGroupChatModal = ({ fetchAgain, setFetchAgain , fetchMessages}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRemove = async(user1) => {
    if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
      toast({
        title:"Only Admins can remove the user !",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom"
      })
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId:user1._id,
        },
        config
      );
      user1._id === user._id ?setSelectedChat():setSelectedChat(data);
      // console.log("setFetchAgain", setFetchAgain);
      setFetchAgain?.(!fetchAgain);
      // console.log("setFetchAgain", setFetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description:  error.message || error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async(user1) => {
    if(selectedChat.users.find((u) => user._id === user1._id)){
      toast({
        title:"User Already Exists !",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom"
      })
      return;
    }
    if(selectedChat.groupAdmin._id !== user._id){
      toast({
        title:"Only Admins can add user !",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom"
      })
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId:user1._id,
        },
        config
      );
      console.log("data", data);
      
      setSelectedChat(data);
      setFetchAgain?.(!fetchAgain);
      setLoading(false);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message|| error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      
      setSelectedChat(data);
      console.log("setFetchAgain", setFetchAgain);
      setFetchAgain?.(!fetchAgain);
      console.log("setFetchAgain", setFetchAgain);
      console.log(data);
      // setFetchAgain(prev => !prev);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description:  "Error Occured"|| error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };


  const handleSearch = async (querry) => {
    setSearch(querry);
    if (!querry) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${querry}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
              {/* {console.log(selectedChat.users)} */}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display={"flex"}>
              <Input
                placeholder="Add User to group"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size={"lg"} />
            ):
            (
              searchResult?.map( (user) =>(
                <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)} />
              ))
            )
            }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
            {/* <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default UpdatedGroupChatModal;
