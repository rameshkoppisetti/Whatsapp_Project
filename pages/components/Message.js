import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../../firebase";

function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);
  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;
  return (
    <Container>
      <TypeOfMessage>
        <Mes>{message.message}</Mes>
        <Timestamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </Timestamp>
      </TypeOfMessage>
    </Container>
  );
}

export default Message;
const Container = styled.div``;
const MessageElement = styled.div`
  width: fit-content;
  padding: 6px;
  padding-left: 8px;
  border-radius: 8px;
  margin: 5px;
  min-width: 60px;
  position: relative;
  font-size: 20px;
  text-align: left;
`;
const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;
const Reciever = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
`;
const Mes = styled.span``;
const Timestamp = styled.span`
  color: grey;
  padding-left: 12px;
  margin-bottom: 0px;
  font-size: 9px;

  text-align: right;
  margin-right: 0;
`;
