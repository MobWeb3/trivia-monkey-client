import { Flex } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import DisplayTitle from "../../components/DisplayTitle";
import CustomButton from "../../components/CustomButton";
import ShareModal from "../../components/share/ShareModal";
import { colors } from "../../components/colors";

type WaitingScreenProps = {
    url: string;
};

const WaitingScreen = ({url}: WaitingScreenProps) => {
    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const openShareModal = () => setShareModalOpen(true);
    const closeShareModal = () => setShareModalOpen(false);
    const urlRef = useRef('');
    const ref = useRef(null); //qr code ref

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
            margin: 5
        },
        cornersDotOptions: {
            color: colors.darkYellow,
            type: "dot" 
        }
    }), []);

    useEffect(() => {
        urlRef.current =url;        
        qrCode.update({
          data: url,
        });
        console.log('qrCode URL to share: ', url);
        if (ref.current) {
            qrCode.append(ref.current);
        }
    }, [qrCode, url]);

    return (
        <Flex
            mih={50}
            bg="rgba(0, 0, 0, .3)"
            gap="md"
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
            style={{ 
                width: '100%',
                padding: '1rem',
            }}
        >
            <DisplayTitle text={'Waiting for others to join'} fontSize='25px' background='#FDD673' />
            <div ref={ref} onClick={openShareModal} />
            {/* add a label to press the QR code to share link*/}
            <CustomButton fontSize='15px' background='#6562DF' color='#FDD673' onClick={openShareModal}> share link </CustomButton>
            <ShareModal url={url} isOpen={isShareModalOpen} onClose={closeShareModal} />
        </Flex>

    );
};

export default WaitingScreen;