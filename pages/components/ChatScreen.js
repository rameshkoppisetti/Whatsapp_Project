import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../../firebase";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import MicIcon from "@material-ui/icons/Mic";
import Message from "./Message";
import { useRef, useState } from "react";
import getRecipientEmail from "../../utils/getRecipientEmail";
import TimeAgo from "timeago-react";
function ChatScreen({ chat, messages }) {
  const endOfMessagesRef = useRef(null);

  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const router = useRouter();
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.user, user))
  );
  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };
  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const sendMessage = (e) => {
    e.preventDefault();
    //Update Last seen..
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });
    setInput("");
    scrollToBottom();
  };
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  //console.log(recipient);
  const recipientEmail = getRecipientEmail(chat.user, user);
  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}

        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading Last active ...</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>
      <InputContainer>
        <InsertEmoticonIcon />

        <Input
          value={input}
          placeholder="Type a message"
          onChange={(e) => setInput(e.target.value)}
        />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
}
const Container = styled.div``;
const Header = styled.div`
  position: sticky;
  background-color: rgb(236, 236, 236);
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  word-break: break-word;
  border-bottom: 0.5px solid rgb(194, 187, 187);
`;
const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;
  > h3 {
    margin-bottom: 2px;
    font-weight: normal;
  }
  > p {
    font-size: 14px;
    color: grey;
    margin-top: 2px;
  }
`;
const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  background-position: sticky;
  min-height: 90vh;
`;
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  color: grey;
  background-color: rgb(236, 236, 236);
  z-index: 100;
`;
const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 22px;
  background-color: white;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;
const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;
const HeaderIcons = styled.div``;
export default ChatScreen;
