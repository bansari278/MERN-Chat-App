
import { VStack } from '@chakra-ui/layout';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import React, {useState} from 'react';
import { Input,InputRightElement,InputGroup } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useHistory } from "react-router";

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const history= useHistory();
 
    const handleClick = () => setShow(!show);

    const submitHandler = async () => {
        setLoading(true);
        if(!email || !password) {
            toast({
                title: "Please Fill all the Fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        console.log(email,password);
        try{
            const config = {
                headers : {
                    "content-type": "application/json",
                },
            };//making the request
            const { data } = await axios.post(
                "/api/user/login", //to this
                {
                    email,
                    password
                },
                config
            );
            console.log(JSON.stringify(data));
            toast({
                title: "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push("/chat");
        } catch (error) {
            toast({
                title: "Error Occured",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };
   
  return (
    <VStack spacing='5px'>
    <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
                <Input 
                type="email" 
                placeholder='Enter Your Email' 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)}
                />
    </FormControl>

     <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input 
                type={show? "text" : "password"} 
                placeholder='Password' 
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show" }
                    </Button>
                </InputRightElement>
                </InputGroup>
        </FormControl>

        <Button 
            colorScheme ="blue"
            width = "100%"
            style = {{marginTop: 15}}
            onClick={submitHandler}

            isLoading={loading}
        >
            Login
        </Button>

         <Button 
            variant="solid"
            colorScheme ="red"
            width = "100%"
            onClick={()=>{
                setEmail("trikmani");
                setPassword("hetvi");
            }}
        >
            Get Guest User Credentials
        </Button>
    </VStack>
  )
}

export default Login
