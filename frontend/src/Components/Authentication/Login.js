import React, {  useState } from "react";
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack} from "@chakra-ui/react";
import axios from 'axios';
import {useHistory} from 'react-router-dom';


const Login = () => {
  const [show,setshow]=useState(false);
  const [email,setemail]=useState();
  const [password,setpassword]=useState();
  const [loading, setloading] = useState(false);
  const toast=useToast();
  const history=useHistory();

  const handleClick =() => setshow(!show);
  const submitHandler = async() =>{
    setloading(true);
    if(!email || !password){
      toast({
        title:"Please Fill all the fields",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom",
      })
      setloading(false);
      return;
    }

    try{
      const config ={
        headers:{
          "Content-type":"application/json",
        }
      };
      const {data} =await axios.post("/api/user/login",
        {email,password},
        config
      );
      toast({
        title:"Login Success",
        status:"success",
        duration:5000,
        isClosable:true,
        position:"bottom",
      });
      localStorage.setItem('userInfo',JSON.stringify(data));

      setloading(false);
      history.push('/chats');
    }catch(error){
      toast({
        title:"Error Occured",
        description:error.response.data.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom",
      });
      setloading(false);
    }



  };
    return (  
      <VStack
        spacing={'5px'}
        align="stretch"
      > 
        <FormControl id='email' isRequired >
        <FormLabel >Email </FormLabel>
        <Input 
        placeholder="Enter Your Email"
        value={email}
        onChange={(e)=> setemail(e.target.value)}
         />
        </FormControl> 
        <FormControl id='password' isRequired >
        <FormLabel >Enter Password </FormLabel>
        <InputGroup>
          <Input 
          type={show?"text":"password"}
          placeholder="Password"
          value={password}
          onChange={(e)=> setpassword(e.target.value)}
           />
          <InputRightElement width={"4.5rem"} >
            <Button h={"1.5rem"} size={"sm"} onClick={handleClick}>
              {show ? "Hide" : "Show"}  
            </Button>
          </InputRightElement>
         </InputGroup>
        </FormControl> 
        <Button 
            colorScheme="blue"
            width={"100%"}
            style={{marginTop:15}}
            onClick={submitHandler}
            isLoading={loading} >
              Login
            </Button>

            <Button 
            variant={"solid"}
            colorScheme="red"
            width={"100%"}
            style={{marginTop:15}}
            onClick={() =>{
              setemail("guest@example.com");
              setpassword("123456");
            }}>
              Get Guest User Credentials
            </Button>  
      </VStack>
    );
};
export default Login;
