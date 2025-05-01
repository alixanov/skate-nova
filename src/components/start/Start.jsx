import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import bgskateboard from '../../assets/backiee-183922-landscape.jpg';

const StartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(rgba(8, 24, 68, 0.75), rgba(98, 0, 234, 0.75)), url(${bgskateboard});
  background-size: cover;
  background-position: center;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  text-align: center;
  position: relative;
  overflow: hidden;
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
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  font-weight: 400;
  max-width: 500px;
  margin-bottom: 1.5rem;
  color: #E6E6FA;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
`;

const LevelCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: ${props => props.bgGradient || 'rgba(255, 255, 255, 0.2)'};
  color: #FFFFFF;
  font-size: 1.4rem;
  font-weight: 500;
  padding: 1rem 2rem;
  margin: 0.5rem;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 300px;
  justify-content: space-between;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px ${props => props.glowColor || 'rgba(0, 0, 0, 0.3)'};
  }

  svg {
    font-size: 2rem;
    filter: drop-shadow(0 0 8px ${props => props.glowColor || '#F9A8D4'});
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

  useEffect(() => {
    // GSAP анимация параллакса фона
    gsap.to('body', {
      backgroundPosition: 'center 30%',
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Анимация появления заголовка
    gsap.fromTo(
      'h1',
      { opacity: 0, y: -120 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }
    );

    // Анимация появления подзаголовка
    gsap.fromTo(
      'p',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.3 }
    );

    // Анимация появления карточек
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

    // GSAP анимация волны
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
      <LevelCard
        className="level-card"
        bgGradient="linear-gradient(to right, #FF006E, #FFD60A)"
        glowColor="#FF006E"
        onClick={handleLevelClick}
      >
        <span>Level 1 - Day City</span>
        <WbSunnyIcon />
      </LevelCard>
      <LevelCard
        className="level-card"
        bgGradient="linear-gradient(to right, #1E1E5F, #00D4FF)"
        glowColor="#00D4FF"
        onClick={handleLevelClick}
      >
        <span>Level 2 - Night Run</span>
        <NightsStayIcon />
      </LevelCard>
      <LevelCard
        className="level-card"
        bgGradient="linear-gradient(to right, #2A4D69, #00F4D6)"
        glowColor="#00F4D6"
        onClick={handleLevelClick}
      >
        <span>Level 3 - Rain Rush</span>
        <WaterDropIcon />
      </LevelCard>
    </StartContainer>
  );
};

export default Start;