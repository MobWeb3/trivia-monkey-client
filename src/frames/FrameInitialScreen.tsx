import { useContext, useMemo, useState } from 'react';
import styles from '../frames/FrameInitialScreen.module.css'
import { CustomButton } from '../components/CustomButton';
import { Container, Flex, Input, Loader, Modal, SegmentedControl } from '@mantine/core';
import { IconPacman } from '@tabler/icons-react';
import SelectedTopicEntries from '../components/topics/SelectedTopicEntries';
import { useDisclosure } from '@mantine/hooks';
import { TopicContext } from '../components/topics/TopicContext';
import { colors } from '../components/colors';
import ChooseTopicComponent from './components/ChooseTopicComponent';
import { createFrame } from '../mongo/FrameHandler';
import { FRAMES_URL } from '../ApiServiceConfig';
import FrameInitiaHeader from './FrameHeader';
import { login } from '../authentication/Login';
import { Web3Auth } from '@web3auth/modal';
// import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { createNftCollection } from '../authentication/solana/metaplex/createNftCollection';
import { bundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr";
import {
    PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
const endpoint = 'https://api.devnet.solana.com';


export const FrameInitialScreenUIComponent = () => {
    const { wallets } = useWallet();

    console.log(wallets);

    const [frameTitle, setFrameTitle] = useState("")
    const [numberQuestions, setNumberQuestions] = useState('1');
    const [opened, { open, close }] = useDisclosure(false);
    const { topics } = useContext(TopicContext);
    const [loading, setLoading] = useState(false);
    const [frameSessionCreated, setFrameSessionCreated] = useState(false);
    const [web3auth, setWeb3auth] = useState<Web3Auth>();

    const handleCreateFrameSubmitted = async () => {
        setLoading(true);

        if (topics.length === 0 || !topics[0]?.metaphor_id) {
            alert('Please select a topic');
            setLoading(false);
            return;
        }

        // console.log('topics: ', topics);
        // console.log('frameTitle: ', frameTitle);
        // console.log('numberQuestions: ', numberQuestions);
        // console.log('metaphor_id: ', topics[0]?.metaphor_id);

        try {
            // Create the frame
            const { frame, questions } = await createFrame({
                name: frameTitle,
                numberOfQuestions: parseInt(numberQuestions),
                topic: {
                    name: topics[0]?.name,
                    metaphor_id: topics[0]?.metaphor_id
                }
            })
            // console.log('frame: ', frame);
            console.log('questions: ', questions);
            const frameSessionURL = generateFrameSessionURL(frame._id);
            console.log('frameSessionURL: ', frameSessionURL);
            setFrameSessionCreated(true);
        }
        catch (error) {
            console.error(error);
            alert('An error occurred while creating the frame');
        }
        setLoading(false)
    };

    // Function to generate a URL for the frame session
    const generateFrameSessionURL = (frameId: string) => {
        return `${FRAMES_URL}/frame/getSession?id=${frameId}`;
    }

    const onConnectWalletClicked = async () => {
        const { currentUserPublicKey, web3auth } = await login();
        console.log('currentUserPublicKey: ', currentUserPublicKey);

        if (currentUserPublicKey) {
            alert(`Coonnected to wallet: ${currentUserPublicKey}`);
        }

        if (web3auth) {
            setWeb3auth(web3auth);
            console.log('web3auth set!');

            console.log('connected wallet[0]:', wallets[0].adapter.name);
            // console.log('connected wallet[1]:', wallets[1].adapter.name);
        }
    }

    const onSignMessageClicked = async () => {

        if (!web3auth) {
            alert('Please connect your wallet first');
            return;
        }

        if (web3auth && web3auth.provider) {
            console.log('selected adapter: ', web3auth.connectedAdapterName);
            // const wallet = new SolanaWallet(web3auth.provider) as unknown as WalletAdapter;
            await wallets[0].adapter.connect();
            const umi = createUmi(endpoint)
                .use(walletAdapterIdentity(wallets[0].adapter))
                .use(bundlrUploader())
                .use(mplTokenMetadata());

            await createNftCollection(umi);
            // 
            // // const message = 'Sign this message';
            // // const signature = await wallet.signAndSendTransaction(message);
            // // console.log('signature: ', signature);
        }

    }


    return (
        <div className={styles.main}>
            <FrameInitiaHeader onConnect={onConnectWalletClicked} />
            {!loading ? <><Flex
                gap="sm"
                justify="center"
                align="center"
                direction="column"
                w="100%"
                h="auto" // Fixed height
            >
                <Input
                    leftSection={<IconPacman />}
                    placeholder="Frame Title"
                    radius="md"
                    styles={{
                        input: {
                            textAlign: 'center',
                            width: '100%',  // Ensure the input field takes up the full width of the div
                            background: '#DAD5D5',
                            opacity: 1,
                            fontFamily: 'umbrage2',
                            fontSize: '32px',
                        },
                    }}
                    onChange={(e) => setFrameTitle(e.currentTarget.value)}
                />

                <Container fluid bg="#FDD673" w="100%" className='container-number-players'>
                    Number of Questions
                </Container>
                <SegmentedControl w='100%'
                    fullWidth size="xl"
                    color="gray"
                    value={numberQuestions}
                    data={[
                        { value: '1', label: '1' },
                        { value: '5', label: '5' },
                        { value: '10', label: '10' },
                    ]}
                    onChange={(value) => {
                        setNumberQuestions(value);
                    }}

                    style={{ fontFamily: 'umbrage2', marginBottom: '10px' }}
                />
                <CustomButton
                    fontSize={"24px"}
                    onClick={open}
                    background='linear-gradient(to bottom right, #FDD673, #D5B45B)'
                    color='#2B2C21'
                    style={{
                        marginTop: '5px',
                        marginBottom: '5px',
                    }}>Pick a topic
                </CustomButton>
                <SelectedTopicEntries
                    entrySize={topics.length}
                />
                <CustomButton
                    onClick={handleCreateFrameSubmitted}
                    style={{
                        marginTop: '5%',
                        marginBottom: '5%',
                    }}
                >Create Frame
                </CustomButton>

                <CustomButton
                    onClick={onSignMessageClicked}
                    style={{
                        marginTop: '5%',
                        marginBottom: '5%',
                    }}
                >Sign Message
                </CustomButton>
            </Flex>
                <Modal
                    yOffset={'5dvh'}
                    opened={opened}
                    onClose={close}
                    radius={'xl'}
                    withCloseButton={false}
                    styles={{
                        body: { backgroundColor: colors.blue_turquoise },
                    }}
                >
                    <ChooseTopicComponent
                        numberOfQuestions={parseInt(numberQuestions)}
                        closeModal={close}
                        style={
                            {
                                backgroundColor: colors.blue_turquoise,
                            }
                        }
                    />
                </Modal></> : null}
            {loading ? <Loader color={colors.yellow} /> : null}
            {frameSessionCreated ? <div>Frame session created</div> : null}
        </div>
    );
}

export const FrameInitialScreen = () => {

    // devnet endpoint
    

    // const endpoint = 'https://api.mainnet-beta.solana.com';

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <FrameInitialScreenUIComponent />
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default FrameInitialScreen;