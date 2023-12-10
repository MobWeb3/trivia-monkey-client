import { Grid } from '@mantine/core';
import { NftGameSession } from '../../game-domain/ nfts/NftGameSession';
import { NftCard } from './NftCard';
import { useEffect, useState } from 'react';

type NftGridProps = {
    nfts: NftGameSession[]; // Replace Nft with the actual type of your NFTs
};

export function NftGrid({ nfts }: NftGridProps) {
    const [cardSpan, setCardSpan] = useState(window.innerWidth >= 768 ? 4 : 6);

    useEffect(() => {
        const handleResize = () => {
          setCardSpan(window.innerWidth >= 768 ? 4 : 6);
        };

        console.log('cardSpan: ', cardSpan);
    
        window.addEventListener('resize', handleResize);
    
        // Clean up the event listener when the component unmounts
        return () => {
          window.removeEventListener('resize', handleResize);
        };
        
      });

    return (
        <Grid>
            {nfts.map((nft) => (
                <Grid.Col span={cardSpan} key={nft.tokenId}> {/* Replace id with the actual property to use as a key */}
                    <NftCard nft={nft} />
                </Grid.Col>
            ))}
        </Grid>
    );
}