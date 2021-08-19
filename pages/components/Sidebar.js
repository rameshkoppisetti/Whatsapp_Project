import { Avatar, Button, IconButton } from "@material-ui/core";
import styled from "styled-components";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { auth, db } from "../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Chat from "./Chat";

function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("user", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt(
      "Please enter a valid email address for the user to chat with"
    );
    if (!input) return null;
    /*const re =
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email;
    console.log(input + "this is " + re);*/
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      //here we add chat to DB
      db.collection("chats").add({
        user: [user.email, input],
      });
    } else {
      console.log("something went wrong");
    }
  };

  const chatAlreadyExists = (recipientEmail) => {
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users?.find((user) => user === recipientEmail)?.length > 0
    );
  };

  return (
    <div>
      <Container>
        <Header>
          <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
          <IconsContainer>
            <IconButton>
              <ChatIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </IconsContainer>
        </Header>
        <Search>
          <SearchIcon size="small" />
          <SearchInput placeholder="        Search or start new chat" />
        </Search>
        <SidebarButton onClick={createChat}>START A NEW CHART</SidebarButton>

        {chatsSnapshot?.docs.map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat.data().user} />
        ))}
      </Container>
    </div>
  );
}

export default Sidebar;
const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid rgb(194, 187, 187);
  height: 100vh;
  font-size: 20px;
  min-width: 30vw;
  max-width: 35vw;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: rgb(236, 236, 236);
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  //border-bottom: 1px solid rgb(167, 167, 167);
`;
const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;
const Search = styled.div`
  display: flex;
  color: grey;
  background-color: whitesmoke;
  align-items: center;
  padding: 14px;
  border-radius: 2px;
`;
const SearchInput = styled.input`
  outline-width: 10px;
  border: none;
  height: 40px;
  border-radius: 15px;
  flex: 1;
`;
const SidebarButton = styled(Button)`
  width: 100%;
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;
const IconsContainer = styled.div``;
