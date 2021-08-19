import { Circle } from "better-react-spinkit";
//import image from "next/image";
function Loading() {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div>
    {/*<imageyarn
          src="https://www.freepnglogos.com/uploads/whatsapp-logo-app-png-4.png"
          alt="whatsapp-logo"
          style={{ marginBottom: 10 }}
          height={200}
        />*/}
        <Circle color="#3CBC28" size={60} />
      </div>
    </center>
  );
}

export default Loading;
