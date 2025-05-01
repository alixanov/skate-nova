import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LockIcon from '@mui/icons-material/Lock';
import bgskateboard from '../../assets/backiee-183922-landscape.jpg';
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
  overflow: hidden;
  padding: 2rem;
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

  @keyframes neonPulse {
    from {
      text-shadow: 0 0 15px rgba(247, 37, 133, 0.7), 0 0 25px rgba(76, 201, 240, 0.7), 0 0 35px rgba(255, 255, 255, 0.5);
    }
    to {
      text-shadow: 0 0 25px rgba(247, 37, 133, 0.9), 0 0 35px rgba(76, 201, 240, 0.9), 0 0 45px rgba(255, 255, 255, 0.7);
    }
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  font-weight: 400;
  max-width: 500px;
  margin-bottom: 2rem;
  color: #E6E6FA;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 900px;
  margin: 0 auto;
`;

const LevelCard = styled.div`
  width: 250px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${props => props.bgGradient || 'rgba(255, 255, 255, 0.2)'};
  color: #FFFFFF;
  border-radius: 16px;
  cursor: ${props => (props.locked ? 'not-allowed' : 'pointer')};
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: ${props => (props.locked ? 0.6 : 1)};

  ${props => !props.locked && `
    &:hover {
      transform: translateY(-5px) scale(1.03);
      box-shadow: 0 12px 30px ${props.glowColor || 'rgba(0, 0, 0, 0.4)'};
      
      &:after {
        opacity: 1;
      }
    }
  `}

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, ${props => props.glowColor || 'rgba(255,255,255,0.2)'} 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

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
`;

const LockedOverlay = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(0, 0, 0, 0.7);
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid #FF006E;
  box-shadow: 0 0 10px rgba(255, 0, 110, 0.5);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: #FF006E;
  text-shadow: 0 0 5px rgba(255, 0, 110, 0.7);
  z-index: 2;

  svg {
    font-size: 1.2rem;
    filter: drop-shadow(0 0 5px #FF006E);
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
`;

const Start = () => {
  const navigate = useNavigate();
  const [unlockedLevels, setUnlockedLevels] = useState(() => {
    // Initialize from localStorage or default to [1] (Level 1 unlocked)
    const saved = localStorage.getItem('unlockedLevels');
    return saved ? JSON.parse(saved) : [1];
  });

  // Update localStorage when unlockedLevels changes
  useEffect(() => {
    localStorage.setItem('unlockedLevels', JSON.stringify(unlockedLevels));
  }, [unlockedLevels]);

  // Function to unlock a level (can be called from game component)
  const unlockLevel = (level) => {
    if (!unlockedLevels.includes(level)) {
      setUnlockedLevels(prev => {
        const newLevels = [...prev, level].sort();
        return newLevels;
      });
    }
  };

  useEffect(() => {
    // GSAP animations
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
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power4.out' }
    );

    gsap.fromTo(
      'p',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.3 }
    );

    gsap.fromTo(
      '.level-card',
      { opacity: 0, y: 60, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.5)',
        delay: 0.5,
      }
    );

    gsap.to('.wave-layer', {
      x: '100%',
      opacity: 0.5,
      duration: 4,
      stagger: 1,
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
          bgGradient="linear-gradient(135deg, #FF006E 0%, #FFD60A 100%)"
          glowColor="rgba(255, 0, 110, 0.7)"
          onClick={handleLevelClick}
          locked={false}
        >
          <WbSunnyIcon />
          <span>Level 1<br />Day City</span>
        </LevelCard>

        <LevelCard
          className="level-card"
          bgGradient="linear-gradient(135deg, #1E1E5F 0%, #00D4FF 100%)"
          glowColor="rgba(0, 212, 255, 0.7)"
          onClick={unlockedLevels.includes(2) ? handleLevelClick : undefined}
          locked={!unlockedLevels.includes(2)}
        >
          <NightsStayIcon />
          <span>Level 2<br />Night Run</span>
          {!unlockedLevels.includes(2) && (
            <LockedOverlay>
              <LockIcon />
              Locked
            </LockedOverlay>
          )}
        </LevelCard>

        <LevelCard
          className="level-card"
          bgGradient="linear-gradient(135deg, #2A4D69 0%, #00F4D6 100%)"
          glowColor="rgba(0, 244, 214, 0.7)"
          onClick={unlockedLevels.includes(3) ? handleLevelClick : undefined}
          locked={!unlockedLevels.includes(3)}
        >
          <WaterDropIcon />
          <span>Level 3<br />Rain Rush</span>
          {!unlockedLevels.includes(3) && (
            <LockedOverlay>
              <LockIcon />
              Locked
            </LockedOverlay>
          )}
        </LevelCard>

        <LevelCard
          className="level-card"
          bgGradient="linear-gradient(135deg, #FFD700 0%, #FF0066 100%)"
          glowColor="rgba(255, 215, 0, 0.7)"
          onClick={handleRecordClick}
          locked={false}
        >
          <EmojiEventsIcon />
          <span>Records</span>
        </LevelCard>
      </CardsContainer>
    </StartContainer>
  );
};

export default Start;