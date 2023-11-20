import { Flex } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import DisplayTitle from "./DisplayTitle";
import CustomButton from "./CustomButton";
import ShareModal from "./share/ShareModal";
import QRCodeStyling from "qr-code-styling";
import useLocalStorageState from "use-local-storage-state";
import { SessionData } from "../screens/SessionData";

const WaitingScreen = () => {
    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const openShareModal = () => setShareModalOpen(true);
    const closeShareModal = () => setShareModalOpen(false);
    const urlRef = useRef('');
    const ref = useRef(null); //qr code ref
    const [sessionData] = useLocalStorageState<SessionData>('sessionData', {});

    const qrCode = useMemo(() => new QRCodeStyling({
        width: 300,
        height: 300,
        type: "svg",
        data: "",
        image: "https://cryptologos.cc/logos/chimpion-bnana-logo.svg",
        dotsOptions: {
            color: "#4267b2",
            type: "rounded"
        },
        backgroundOptions: {
            color: "#e9ebee",
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 20
        }
    }), []);

    useEffect(() => {
        const url = `${window.location.origin}/joingame?sessionId=${sessionData?.sessionId}&channelId=${sessionData?.channelId}`;
        urlRef.current =url;        qrCode.update({
          data: url,
        });
        console.log('qrCode URL to share: ', url);
        if (ref.current) {
            qrCode.append(ref.current);
        }
    }, [qrCode, sessionData?.channelId, sessionData?.sessionId]);

    return (
        <Flex
            mih={50}
            bg="rgba(0, 0, 0, .3)"
            gap="md"
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
        >
            <DisplayTitle text={'Waiting for others to join'} fontSize='25px' background='#FDD673' />
            <div ref={ref} onClick={openShareModal} />
            {/* add a label to press the QR code to share link*/}
            <CustomButton fontSize='15px' background='#6562DF' color='#FDD673' onClick={openShareModal}> share link </CustomButton>
            <ShareModal url={urlRef.current} isOpen={isShareModalOpen} onClose={closeShareModal} />
        </Flex>

    );
};

export default WaitingScreen;