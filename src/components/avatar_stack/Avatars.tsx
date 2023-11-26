import { useEffect, useState } from "react";
import classNames from "classnames";

import {
  MAX_USERS_BEFORE_LIST,
  calculateRightOffset,
  calculateTotalWidth,
} from "../utils/helpers";
import Surplus from "./Surplus";
import UserInfo from "./UserInfo";

import type { Member } from "../utils/helpers";

import styles from "./Avatars.module.css";
import { useSpace } from "@ably/spaces/dist/mjs/react";
import useGameBoardState from "../../polybase/useGameBoardState";
import useLocalStorageState from "use-local-storage-state";
import { SessionData } from "../../screens/SessionData";
import { GameBoardState } from "../../game-domain/Session";

const SelfAvatar = ({ self, gameBoardState }: 
{ self: Member | null;
  gameBoardState: GameBoardState;
}) => {
  const [hover, setHover] = useState(false);
  const { space } = useSpace();
  
  // sessionData
  const [sessionData] = useLocalStorageState<SessionData>('sessionData', {});

  // Get the game board state
  // const gameBoardState: GameBoardState = useGameBoardState();
  
  /**
   * 💡 Get the latest scores for the the given avatar 💡
   */
  useEffect(() => {
    if (!space) return;
    // console.log('gameBoardState:', gameBoardState);
    if (sessionData && sessionData.clientId) {
      // console.log(`gameBoardState-${sessionData.clientId}`, gameBoardState[sessionData.clientId]);
    }

  }, [gameBoardState, sessionData, space]);


  function getSelfScore() {
    if (sessionData && sessionData.clientId) {
      // console.log(`gameBoardState-${sessionData.clientId}`, gameBoardState[sessionData.clientId]);
      return gameBoardState[sessionData.clientId];
    }
    return 0;
  }
  return (
    <div
      className={styles.avatar}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundImage: `url(${self?.profileData.avatar})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={styles.scoreBox}>
        <p className={styles.scoreText}>{getSelfScore()}</p>
      </div>
      {/* <p className={styles.name}>You</p> */}
      <div className={styles.statusIndicatorOnline} id="status-indicator" />
      
      {hover && self ? (
        <div className={styles.popup}>
          <UserInfo user={self} isSelf={true} />
        </div>
      ) : null}
    </div>
  );
};

const OtherAvatars = ({
  users,
  usersCount,
  gameBoardState,
}: {
  users: Member[];
  usersCount: number;
  gameBoardState: GameBoardState;
}) => {
  const [hoveredClientId, setHoveredClientId] = useState<string | null>(null);
  return (
    <>
      {users.map((user, index) => {
        const rightOffset = calculateRightOffset({ usersCount, index });

        // get score from gameBoardState for this user
        function getScore() {
          if (user.clientId) {
            // console.log(`gameBoardState-${user.clientId}`, gameBoardState[user.clientId]);
            return gameBoardState[user.clientId];
          }
          return 0;
        }

        const statusIndicatorCSS = classNames(
          {
            [styles.statusIndicatorOnline]: user.isConnected,
            [styles.inactiveBackground]: !user.isConnected,
          },
          styles.statusIndicator,
        );

        return (
          <div
            className={styles.avatarContainer}
            key={user.clientId}
            style={{
              right: rightOffset,
              zIndex: users.length - index,
            }}
          >
              <div
                className={styles.avatar}
                style={{
                  backgroundImage: `url(${user.profileData.avatar})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                onMouseOver={() => setHoveredClientId(user.clientId)}
                onMouseLeave={() => setHoveredClientId(null)}
                id="avatar"
              >
              {/* Add a small score box on the bottom of the avatar */}
              <div className={styles.scoreBox}>
                <p className={styles.scoreText}>{
                  getScore()
                }</p>
              </div>
              <div className={statusIndicatorCSS} id="status-indicator" />
            </div>

            {hoveredClientId === user.clientId ? (
              <div className={styles.popup}>
                <UserInfo user={user} />
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
};

const Avatars = ({
  otherUsers,
  self,
}: {
  otherUsers: Member[];
  self: Member | null;
}) => {
  const totalWidth = calculateTotalWidth({ users: otherUsers });
  // Get the game board state
  const gameBoardState: GameBoardState = useGameBoardState();

  useEffect(() => {
    // console.log('gameBoardState:', gameBoardState);
  }, [gameBoardState]);
    

  return (
    <div className={styles.container} style={{ width: `${totalWidth}px` }}>
      <SelfAvatar self={self} gameBoardState= {gameBoardState} />
      <OtherAvatars
        usersCount={otherUsers.length}
        users={otherUsers.slice(0, MAX_USERS_BEFORE_LIST).reverse()}
        gameBoardState= {gameBoardState}
      />
      {/** 💡 Dropdown list of surplus users 💡 */}
      <Surplus otherUsers={otherUsers} />
    </div>
  );
};

export default Avatars;
