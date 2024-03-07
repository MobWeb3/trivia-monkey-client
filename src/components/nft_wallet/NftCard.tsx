import { Card, Image, Text, Group, Button } from '@mantine/core';
import { NftGameSession } from '../../game-domain/ nfts/NftGameSession';
import { createWarpcastLink } from '../share/WarpCastLink';

type NftCardProps = {
    nft: NftGameSession;
    setJoinLink?: (link: string) => void;
    openShareModal?: () => void;
  };

export function NftCard({nft, setJoinLink, openShareModal}: NftCardProps) {

  function getIpfsHashFromUrl(url?: string) {
    if (url === undefined) return "";
    const parts = url.split('/');
    const ipfsHash = parts[2].split('.')[0];
    return ipfsHash;
  }

  function getCloudflareIpfsUrl(url?: string) {
    const ipfsHash = getIpfsHashFromUrl(url);
    return `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`;
  }
  
  return ( 
     <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section /*component="a" href="https://mantine.dev/*/>
        <Image
          src={nft.image ? getCloudflareIpfsUrl(nft.image) : "https://bafybeiahlgcpkogk3rynat27ol4mdi7my3t7ykrrlel5wxnmpcy2fgmxqi.ipfs.nftstorage.link/"}
          height={160}
          alt="Nft image"
          fit="contain"
          bg={'dark'}
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{nft.name ?? "name"}</Text>
        {/* <Badge color="pink">On Sale</Badge> */}
      </Group>

      <Text size="sm" c="dimmed">
        {nft.description ?? nft.raw?.error}
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md"
        onClick={() => {
          console.log('Start game with NFT: ', nft);

          openShareModal && openShareModal();
          const embed = `${window.location.origin}?page=join&sessionId=${nft.session?.sessionId}&channelId=${nft.session?.channelId}`

          console.log('embed: ', embed);
          const warpcastUrl = createWarpcastLink("Let's continue playing our game!", [embed]);
          setJoinLink && setJoinLink(warpcastUrl);
          console.log('warpcastUrl: ', warpcastUrl);
        }}
      >
        Start
      </Button>
    </Card>
  );
}