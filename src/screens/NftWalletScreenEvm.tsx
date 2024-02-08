import { Flex, Title } from '@mantine/core';
import './NftWalletScreenEvm.css'
import { NftGameSession } from '../game-domain/ nfts/NftGameSession';
import { NftGrid } from '../components/nft_wallet/NftGrid';
import { getNftsFromSmartAccount, providerWithAlchemyEnhancedApis } from '../evm/alchemy/EnhancedApis';
import { getProvider } from '../evm/alchemy/Web3AuthSigner';
import { OwnedNftsResponse } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { SelectNetwork } from '../components/nft_wallet/SelectNetwork';
import { SupportedNetworks } from '../SupportedNetworksConfig';
import useLocalStorageState from 'use-local-storage-state';
import { SessionData } from './SessionData';
import { getNftsForOwner } from '../evm/alchemy/FetchNftsInefficient';
import { getWeb3AuthSigner } from '../authentication/Web3AuthAuthentication';
// import { SupportedNetworks } from '../../';

const NftWalletScreenEvm = () => {
    const [nfts, setNfts] = useState<NftGameSession[]>([]);
    const [sessionData] = useLocalStorageState<SessionData>('sessionData');

    useEffect(() => {
        if (SupportedNetworks.Fuji === sessionData?.nftWalletNetwork) {
            console.log('Fuji network');

            getNftsForOwner().then((nfts) => {
                // console.log('nfts: ', nfts);
                setNfts(nfts);
            });

        } else {
            const getNfts = async () => {
                const signer = await getWeb3AuthSigner();
                if (signer === undefined) {
                    console.log('signer is undefined');
                    return [];
                }
                const provider = getProvider(signer);
                const providerWithAlchemy = providerWithAlchemyEnhancedApis(provider);
                const nfts: OwnedNftsResponse = await getNftsFromSmartAccount(providerWithAlchemy);
        
                // Lets create an array of NftGameSession from nfts which is OwnedNftsResponse
                const nftGameSessions: NftGameSession[] = nfts.ownedNfts.map((nft) => {
                    return {
                        name: nft.name,
                        description: nft.description,
                        image: nft.image?.cachedUrl,
                        tokenId: nft.tokenId,
                        timestampMint: nft.mint?.timestamp,
                        attributes: nft.raw.metadata,
                        raw: nft.raw,
                    } as NftGameSession;
                });
    
                setNfts(nftGameSessions);
            };
    
            getNfts();
        }
    }, [sessionData?.nftWalletNetwork]);

    return (
        <div className="nftWalletScreenEvm">
            <Flex
                mih={50}
                gap="md"
                justify="center"
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
                    margin: "auto",
                }}
            >
                <SelectNetwork/>
                <Title order={2} 
                    bg={"white"}
                    style={{
                        borderRadius: 20,
                        padding: 10,
                        opacity: 0.9,
                    }}
                >NFT Game Sessions</Title>
                <NftGrid nfts={nfts}></NftGrid>
            </Flex>
        </div>
    );

};

export default NftWalletScreenEvm;