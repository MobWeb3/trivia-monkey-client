import { Flex, Title } from '@mantine/core';
import classes from './NftWalletScreenSolana.module.css';
import { useEffect, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { NftGameSession } from '../../../game-domain/ nfts/NftGameSession';
import { NftGrid } from '../../nft_wallet/NftGrid';
import { AuthSessionData } from '../../../game-domain/AuthSessionData';
import { createWeb3AuthSolanaSigner } from '../../../solana/web3auth';
import { getConnectedSolanaPublicKey } from '../../../authentication/solana/utils';
import { UserCardImage } from '../UserCardImage';
import { Loader } from '@mantine/core';
import { getNftsByOwner } from '../../../solana/metaplex/getNftsHandler';

const NftWalletScreenSolana = () => {
    const [nfts, setNfts] = useState<NftGameSession[]>([]);
    const [authSessionData] = useLocalStorageState<AuthSessionData>('authSessionData', {});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // current network
        console.log('authSessionData?.currentNetwork: ', authSessionData?.currentNetwork);

        // Fetch nft for current solana account
        const fetchNfts = async () => {
            const web3authSigner = await createWeb3AuthSolanaSigner();
            const publicKey = await getConnectedSolanaPublicKey(web3authSigner.inner);
            console.log('publicKey: ', publicKey?.toBase58());
            if (publicKey) {
                const nfts = await getNftsByOwner({
                    // address: publicKey.toBase58(),
                    address: publicKey.toBase58(),
                    start: 0,
                    end: 10
                });
                console.log('nfts: ', nfts);
                setNfts(nfts);
            }
            setLoading(false);
        }

        fetchNfts();
    }, [authSessionData?.currentNetwork]);

    return (
        <div className={classes.background}>
            <div className={classes.nftWalletScreenSolana}>
                <Flex
                    gap="md"
                    justify="start"
                    align="center"
                    direction="column"
                    wrap="wrap"
                    style={{
                        // add opacity to the background
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        // radius for the whole component
                        borderRadius: 20,
                        // padding for the whole component
                        padding: 20,
                        // margin: 20,
                        top: "10%",
                        width: "90%",
                        margin: "auto",
                    }}
                >
                    {loading ? <Loader /> :
                        <><UserCardImage userInfo={authSessionData?.userInfo} />
                            <Title order={2}
                                bg={"white"}
                                style={{
                                    borderRadius: 20,
                                    padding: 10,
                                    opacity: 0.9,
                                }}
                            >NFT Game Sessions</Title>
                            <NftGrid nfts={nfts}></NftGrid></>
                    }

                </Flex>
            </div>
        </div>

    );

};

export default NftWalletScreenSolana;
