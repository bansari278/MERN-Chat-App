
import {useEffect} from "react";
import { 
  Box, 
  Text, 
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
 } from "@chakra-ui/react";
 import Login from "../components/Authentication/Login";
 import Signup from "../components/Authentication/Signup";
 import { useHistory } from "react-router-dom";

export const Homepage = () => { 

  const history = useHistory();

  useEffect (() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if(user) history.push("/chats");
  },[history]);
  
  return (
    <Container  maxW="xl" centerContent>
        <Box        
        d="flex"
        p={3}
        bg={"white"}  
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        w="100%"
        >
        <Text fontSize="4xl" align="center" fontFamily="Work sans" color="black">Talk-A-Tive</Text>
        </Box>
        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" color="black"> 
        <Tabs variant='soft-rounded'>
        <TabList mb="1em">
        <Tab width="50%">Login</Tab> 
        <Tab width="50%">Sign Up</Tab>
        </TabList>
        <TabPanels>
        <TabPanel><Login/></TabPanel>
        <TabPanel><Signup/></TabPanel>
        </TabPanels>
        </Tabs>
        
        </Box>


    </Container>
  )
}
