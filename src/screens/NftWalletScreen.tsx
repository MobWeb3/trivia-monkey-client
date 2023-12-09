import { Flex, Title } from '@mantine/core';
import './NftWalletScreen.css'
import { NftGameSession } from '../game-domain/ nfts/NftGameSession';
import { NftGrid } from '../components/nft_wallet/NftGrid';

const NftWalletScreen = () => {

    const getSomeNfts = () => {
        const nfts: NftGameSession[] = [
            {
                tokenId: 1,
            },
            {
                tokenId: 2,
            },
            {
                tokenId: 3,
            },
            {
                tokenId: 4,
            }
        ];
        return nfts as NftGameSession[];
    };

    return (
        <div className="nftWalletScreen">
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
                <Title order={2} 
                    bg={"white"}
                    style={{
                        borderRadius: 20,
                        padding: 10,
                        opacity: 0.9,
                    }}
                >NFT Game Sessions</Title>
                <NftGrid nfts={getSomeNfts()}></NftGrid>
            </Flex>
        </div>
    );

};

export default NftWalletScreen;