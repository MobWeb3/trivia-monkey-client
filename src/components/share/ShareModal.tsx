import React from 'react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';
import './ShareModal.css';

type ShareModalProps = {
    url: string;
    isOpen: boolean;
    onClose: () => void;
  };

const ShareModal: React.FC<ShareModalProps> = ({ url, isOpen, onClose }) => {
  if (!isOpen) return null;

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
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ShareModal;
