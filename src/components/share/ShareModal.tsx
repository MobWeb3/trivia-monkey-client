import React from 'react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';
import './ShareModal.css';
import warpcastIcon from '../../assets/icons/warpcast-icon.png';

type ShareModalProps = {
    url: string;
    isOpen: boolean;
    onClose: () => void;
  };

const ShareModal: React.FC<ShareModalProps> = ({ url, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleWarpcastShare = () => {
    if (url)
      window.open(url, '_blank');
  };

  return (
    <div className="shareModalBackdrop">
      <div className="shareModal">
        <h3>Share Game</h3>
        <FacebookShareButton url={url}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={url}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <WhatsappShareButton url={url}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <button onClick={handleWarpcastShare} className="customShareButton">
          <img src={warpcastIcon} alt="Warpcast" width="32" height="32" />
        </button>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ShareModal;


/**
 * New Farcaster developer utility: 

cast intents  

Using the http://warpast.com/~/compose URL with text and embed parameters will generate a deeplink into Warpcast apps with a pre-populated cast.

https://warpcast.com/~/compose?text=The%20best%20essay%20for%20understanding%20why%20people%20use%20new%20social%20networks&embeds[]=https://trivia-monkey-client.vercel.app/

 */