import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LockIcon from '@mui/icons-material/Lock';
import XIcon from '@mui/icons-material/X';
import bgskateboard from '../../assets/bg.png';
import ramka from '../../assets/gas-kvas-com-p-chernaya-ramka-dlya-nadpisi-na-prozrachnom-41.png';

const StartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(rgba(8, 24, 68, 0.75), rgba(98, 0, 234, 0.75)), url(${bgskateboard});
  background-size: cover;
  background-position: center;
  color: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  position: relative;
  overflow: auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 5.5rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #F72585, #4CC9F0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(247, 37, 133, 0.7), 0 0 25px rgba(76, 201, 240, 0.7);
  animation: neonPulse 2s ease-in-out infinite alternate;
  will-change: transform, opacity;

  @keyframes neonPulse {
    from {
      text-shadow: 0 0 15px rgba(247, 37, 133, 0.7), 0 0 25px rgba(76, 201, 240, 0.7), 0 0 35px rgba(255, 255, 255, 0.5);
    }
    to {
      text-shadow: 0 0 25px rgba(247, 37, 133, 0.9), 0 0 35px rgba(76, 201, 240, 0.9), 0 0 45px rgba(255, 255, 255, 0.7);
    }
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  font-weight: 400;
  max-width: 500px;
  margin-bottom: 2rem;
  color: #E6E6FA;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
  will-change: transform, opacity;

  @media (max-width: 768px) {
    font-size: 1rem;
    max-width: 90%;
    margin-bottom: 1rem;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 1rem;
  }
`;

const LevelCard = styled.div`
  width: 250px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: #FFFFFF;
  border-radius: 11px;
  cursor: ${props => (props.locked ? 'not-allowed' : 'pointer')};
  box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.3), 0 8px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  opacity: ${props => (props.locked ? 0.6 : 1)};
  will-change: transform, opacity;

  ${props => !props.locked && `
    &:active {
      transform: translateY(-5px) scale(1.03);
      box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.4), 0 12px 30px ${props.glowColor || 'rgba(0, 0, 0, 0.4)'};
      backdrop-filter: blur(12px);
    }
  `}

  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    filter: drop-shadow(0 0 8px ${props => props.glowColor || '#F9A8D4'});
  }

  span {
    font-size: 1.3rem;
    font-weight: 600;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    z-index: 1;
  }

  @media (max-width: 768px) {
    width: 90%;
    max-width: 300px;
    height: 120px;
    padding: 1rem;

    svg {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    span {
      font-size: 1rem;
    }
  }
`;

const LockedOverlay = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  z-index: 2;

  svg {
    font-size: 1.2rem;
    color: #F72585;
    filter: drop-shadow(0 0 5px #F72585);
  }

  @media (max-width: 768px) {
    top: 8px;
    right: 8px;

    svg {
      font-size: 1rem;
    }
  }
`;

const NeonWave = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;

  div {
    position: absolute;
    width: 100%;
    height: 100px;
    background: linear-gradient(to right, transparent, #F72585, #4CC9F0, transparent);
    opacity: 0.3;
    animation: waveMove 4s linear infinite;
  }

  div:nth-child(1) {
    top: 20%;
    animation-duration: 4s;
  }
  div:nth-child(2) {
    top: 40%;
    animation-duration: 3.5s;
    animation-delay: 1s;
    opacity: 0.4;
  }
  div:nth-child(3) {
    top: 60%;
    animation-duration: 4.5s;
    animation-delay: 2s;
    opacity: 0.2;
  }

  @keyframes waveMove {
    0% {
      transform: translateX(-100%);
      opacity: 0.3;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      transform: translateX(100%);
      opacity: 0.3;
    }
  }

  @media (max-width: 768px) {
    div {
      height: 50px;
      opacity: 0.2;
      animation-duration: 3s;
    }

    div:nth-child(1) {
      animation-duration: 3s;
    }
    div:nth-child(2) {
      animation-duration: 2.5s;
    }
    div:nth-child(3) {
      animation-duration: 3.5s;
    }
  }
`;

const Start = () => {
  const navigate = useNavigate();
  const [unlockedLevels, setUnlockedLevels] = useState(() => {
    const saved = localStorage.getItem('unlockedLevels');
    return saved ? JSON.parse(saved) : [1];
  });

  useEffect(() => {
    localStorage.setItem('unlockedLevels', JSON.stringify(unlockedLevels));
  }, [unlockedLevels]);

  const unlockLevel = (level) => {
    if (!unlockedLevels.includes(level)) {
      setUnlockedLevels(prev => {
        const newLevels = [...prev, level].sort();
        return newLevels;
      });
    }
  };

  useEffect(() => {
    gsap.to('body', {
      backgroundPosition: 'center 30%',
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.fromTo(
      'h1',
      { opacity: 0, y: -120, scale: 0.7 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power4.out'
      }
    );

    gsap.fromTo(
      'p',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.2
      }
    );

    gsap.fromTo(
      '.level-card',
      { opacity: 0, y: 60, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'back.out(1.5)',
        delay: 0.3,
      }
    );

    gsap.to('.wave-layer', {
      x: '100%',
      opacity: 0.5,
      duration: 3,
      stagger: 0.8,
      repeat: -1,
      ease: 'none',
    });
  }, []);

  const handleLevelClick = () => {
    navigate('/images-people');
  };

  const handleRecordClick = () => {
    navigate('/record');
  };

  const handleFollowClick = () => {
    window.open('https://x.com/trenches_skate', '_blank', 'noopener,noreferrer');
  };

  return (
    <StartContainer>
      <NeonWave>
        <div className="wave-layer"></div>
        <div className="wave-layer"></div>
        <div className="wave-layer"></div>
      </NeonWave>

      <Title>SkateNova</Title>
      <Subtitle>
        Welcome to SkateNova — an arcade runner on a scooter! Ride along endless roads, collect bonuses, avoid obstacles and conquer unique levels!
      </Subtitle>

      <CardsContainer>
        <LevelCard
          className="level-card"
          glowColor="rgba(255, 0, 110, 0.7)"
          onClick={handleLevelClick}
          locked={false}
        >
          <WbSunnyIcon />
          <span>Level 1<br />Day City</span>
        </LevelCard>

        <LevelCard
          className="level-card"
          glowColor="rgba(0, 212, 255, 0.7)"
          onClick={unlockedLevels.includes(2) ? handleLevelClick : undefined}
          locked={!unlockedLevels.includes(2)}
        >
          <NightsStayIcon />
          <span>Level 2<br />Night Run</span>
          {!unlockedLevels.includes(2) && (
            <LockedOverlay>
              <LockIcon />
            </LockedOverlay>
          )}
        </LevelCard>

        <LevelCard
          className="level-card"
          glowColor="rgba(0, 244, 214, 0.7)"
          onClick={unlockedLevels.includes(3) ? handleLevelClick : undefined}
          locked={!unlockedLevels.includes(3)}
        >
          <WaterDropIcon />
          <span>Level 3<br />Rain Rush</span>
          {!unlockedLevels.includes(3) && (
            <LockedOverlay>
              <LockIcon />
            </LockedOverlay>
          )}
        </LevelCard>

        <LevelCard
          className="level-card"
          glowColor="rgba(255, 215, 0, 0.7)"
          onClick={handleRecordClick}
          locked={false}
        >
          <EmojiEventsIcon />
          <span>Records</span>
        </LevelCard>

        <LevelCard
          className="level-card"
          glowColor="rgba(106, 255, 98, 0.7)"
          onClick={handleFollowClick}
          locked={false}
          aria-label="Follow us on X"
        >
          <XIcon aria-hidden="true" />
          <span>Follow us</span>
        </LevelCard>
      </CardsContainer>
    </StartContainer>
  );
};

export default Start;