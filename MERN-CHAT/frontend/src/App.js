import { Button } from '@chakra-ui/react';
import './App.css';
import {Route} from "react-router-dom";
import { Homepage } from './Pages/Homepage';
import { ChatPage } from './Pages/ChatPage';


function App() {
  return (
    <div className="App">
      {/* <Button colorScheme='blue'>Button</Button> */}
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={ChatPage}/>
    </div>
  );
}

export default App;
