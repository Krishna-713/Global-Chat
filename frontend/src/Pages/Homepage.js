import React from "react";
import {  useEffect } from "react";

import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../Components/Authentication/Login";
import SignUp from "../Components/Authentication/Signup";
import { useHistory } from "react-router-dom";

const Homepage = () => {
  const history=useHistory();
    useEffect(()=>{
        const user =JSON.parse(localStorage.getItem("userInfo"));
        if(user) history.push("/chats");
    },[history]);
  
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color="black">
          Global Chat
        </Text>
      </Box>
      <Box bg={"white"} color={"black"} w={"100%"} p={4} borderRadius={"lg"}>
        <Tabs variant="soft-rounded" >
          <TabList mb="1em">
            <Tab width={"50%"}>Log In</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel> <Login/>
            </TabPanel>
            <TabPanel> <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};
export default Homepage;
