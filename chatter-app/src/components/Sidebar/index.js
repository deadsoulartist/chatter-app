import React, { useState, useEffect } from "react";
import "./index.css";
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ChatIcon from "@material-ui/icons/Chat";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { SearchOutlined } from "@material-ui/icons/";
import SidebarChat from "./SidebarChat/index";
import db from "../../firebase";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../stateManagement/reducer";

function Sidebar() {
  // connecting to db
  const [rooms, setRooms] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    const unsubscribe = db
      .collection("rooms")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setRooms(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })))
      );

    return () => {
      unsubscribe();
    };
  }, []);

  const logout = () => {
    dispatch({
      type: actionTypes.SET_USER,
      user: null,
    });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar-headerRight">
          <button className="signout-btn" onClick={logout}>
            <ExitToAppIcon />
            &nbsp;Sign out
          </button>
        </div>
      </div>

      <div className="sidebar-search">
        <div className="sidebar-searchContainer">
          <SearchOutlined />
          <input placeholder="Search or start new chat room" type="text" />
        </div>
      </div>

      <div className="sidebar-chats">
        <SidebarChat addNewChat />
        {rooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
