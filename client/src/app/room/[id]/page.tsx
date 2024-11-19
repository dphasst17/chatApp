"use client";
import { accountStore } from "@/stores/account";
import { decode } from "@/utils/util";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
const Room = ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { account } = accountStore();
  const router = useRouter();
  const roomID = params.id;
  useEffect(() => {
    const list = decode(searchParams.l as string, process.env.NEXT_PUBLIC_SK!);
    const checkList = account && list.includes(account.idUser);
    if (!checkList) {
      router.push("/");
      return;
    }
  }, [searchParams]);
  const myMeeting: any = async (element: any) => {
    const { ZegoUIKitPrebuilt } = await import(
      "@zegocloud/zego-uikit-prebuilt"
    );
    // generate Kit Token
    const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!);
    const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      uuid(),
      account ? account.name : "anonymous",
      720,
    );

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    // start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Shareable link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?role=u&&l=" +
            searchParams.l,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      maxUsers: 10,
      showTextChat: false,
      layout: "Grid",
      showScreenSharingButton: false,
      showPreJoinView: true,
      lowerLeftNotification: {
        showUserJoinAndLeave: true,
      },
      onReturnToHomeScreenClicked: () => {
        router.push("/");
      },
      onUserJoin(users) {
        toast.success(`${users[0].userName} has joined the room`);
        /* if (users[0].userName === "anonymous") {
                    toast.success("Anonymous user joined the room");
                    console.log("Anonymous user joined the room");
                } */
      },

      onUserLeave(users) {
        toast.error(`${users[0].userName} has left the room`);
        console.log("Anonymous user left the room");
      },
    });
  };

  const myRef = (element: any) => {
    myMeeting(element);
  };
  return (
    <div
      className="myCallContainer"
      ref={myRef}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
};

export default Room;
