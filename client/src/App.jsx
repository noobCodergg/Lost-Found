

import Registration from "./Pages/registration";
import Otp from "./Pages/otp";
import Login from "./Pages/login"; // fix import: use your custom Login component

import { Route, Routes } from "react-router-dom";
import UserProvider from "./Context/UserContext";
import ProtectedRoute from "./Routes/protectedRoute";




import Unauthorized from "./Pages/Unauthorized";
import Navbar from "./Pages/Navbar";
import Home from "./Pages/Home";


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PostForm from "./Pages/post";
import ItemList from "./Pages/ItemList";
import Chat from "./Pages/chat";
import ChatList from "./Pages/ChatList";





function App() {
  return (
    <UserProvider>
      <Navbar />
      <Routes>
        
        <Route path="/registration" element={<Registration />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Home/>}/>
        
           <Route
          path="/post"
          element={
            <ProtectedRoute role={["admin","user"]}>
              <PostForm/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/item-list"
          element={
            <ProtectedRoute role={["admin","user"]}>
              <ItemList/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/text/:id"
          element={
            <ProtectedRoute role={["admin","user"]}>
              <Chat/>
            </ProtectedRoute>
          }
        />


          <Route
          path="/chat"
          element={
            <ProtectedRoute role={["admin","user"]}>
              <ChatList/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </UserProvider>
  );
}

export default App;
