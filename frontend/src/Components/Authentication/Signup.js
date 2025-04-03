import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from 'axios';
import {useHistory} from 'react-router-dom';

const Signup = () => {
  const [show, setshow] = useState(false);
  const [name, setname] = useState();
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [confirmpassword, setconfirmpassword] = useState();
  const [pic, setpic] = useState();
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const history=useHistory();
  const handleClick = () => setshow(!show);
  const postDetails = (pic) => {
    setloading(true);
    if (pic === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position:"bottom",
      });
      setloading(false);
      return;
    }
    console.log(pic);
    if(pic.type==="image/jpeg"||pic.type==="image/png"){
      const data= new FormData();
      data.append("file",pic);
      data.append("upload_preset","Global-chat");
      data.append("cloud_nane","dfyrijffp");
            
      fetch("https://api.cloudinary.com/v1_1/dfyrijffp/image/upload",{
        method:"post",
        body:data,
      }).then((res)=> res.json())
      .then((data) =>{
         setpic(data.url.toString());
         setloading(false);
      })
      .catch((err)=>{
        console.log(err);
        setloading(false);
      });
    }
    else{
      toast({
        title:"Please Select an Image!",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom",
      });
      setloading(false);
      return;
    }
  };
  const submitHandler = async() => {
    setloading(true);
    if(!name || !email || !password|| !confirmpassword){
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
    if(password !== confirmpassword){
      toast({
        title:"Password Do not Match",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom",
      })
      return;
    }
    try{
      const config ={
        headers:{
          "Content-type":"application/json",
        }
      };
      const {data} =await axios.post(
        "/api/user",
        {name,email,password,pic},
        config
      );
      toast({
        title:"Registeration Successful",
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
    <VStack spacing={"5px"} align="stretch">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name </FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setname(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email </FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setemail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Enter Password </FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setpassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h={"1.5rem"} size={"sm"} onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password </FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setconfirmpassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h={"1.5rem"} size={"sm"} onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Enter Your Pic</FormLabel>
        <Input
          type={"file"}
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0] ) }
        />
        <Button
          colorScheme="blue"
          width={"100%"}
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </FormControl>
    </VStack>
  );
};
export default Signup;
