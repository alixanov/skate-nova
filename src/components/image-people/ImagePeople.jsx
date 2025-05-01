import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import blaze from '../../assets/1.png';
import shadow from '../../assets/2.png';
import nova from '../../assets/3.png';

const characters = [
  {
    name: 'Blaze',
    description: 'Street Flame. Speed is his element.',
    fullDescription: 'Flies by, leaving sparks. Fire in his eyes, audacity in his moves.',
    skill: 'Instant speed boost and spectacular start.',
    image: blaze,
    emoji: '🔥',
    animation: 'blaze',
    bgGradient: 'linear-gradient(135deg, #FF006E 0%, #FF8E53 100%)',
    glowColor: 'rgba(255, 0, 110, 0.7)',
  },
  {
    name: 'Shadow',
    description: 'Metropolis Shadow. Elusive and precise.',
    fullDescription: 'Glides like a ghost. Quiet as night, dangerous as a turn.',
    skill: 'Enhanced control and stealth.',
    image: shadow,
    emoji: '🌌',
    animation: 'shadow',
    bgGradient: 'linear-gradient(135deg, #1E1E5F 0%, #00D4FF 100%)',
    glowColor: 'rgba(0, 212, 255, 0.7)',
  },
  {
    name: 'Nova',
    description: 'Urban Star. Trick icon.',
    fullDescription: 'Dances on the track. Fountains of light and beats under the wheels.',
    skill: 'Trick points and combo bonus.',
    image: nova,
    emoji: '🌟',
    animation: 'nova',
    bgGradient: 'linear-gradient(135deg, #2A4D69 0%, #00F4D6 100%)',
    glowColor: 'rgba(0, 244, 214, 0.7)',
  },
];

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(rgba(8, 24, 68, 0.75), rgba(98, 0, 234, 0.75)),
              linear-gradient(to right, #F72585, #4CC9F0);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #fff;
  text-shadow: 0 0 12px rgba(247, 37, 133, 0.8);
  margin-bottom: 1rem;
  text-align: center;
  font-family: 'Orbitron', sans-serif;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #e0e0e0;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
  text-align: center;
  max-width: 600px;
  font-family: 'Roboto', sans-serif;
`;

const CharactersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  margin-top: 2rem;
  z-index: 2;
`;

const CharacterCard = styled.div`
  background: ${({ bgGradient }) => bgGradient};
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), 0 0 10px ${({ glowColor }) => glowColor};

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4), 0 0 20px ${({ glowColor }) => glowColor};
  }

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const CharacterImage = styled.img`
  width: 100%;
  max-width: 200px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: transform 0.4s ease;
`;

const CharacterName = styled.h3`
  font-size: 1.8rem;
  color: #fff;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: 'Orbitron', sans-serif;
`;

const CharacterDescription = styled.p`
  font-size: 1rem;
  color: #e0e0e0;
  margin-bottom: 0.5rem;
`;

const CharacterSkill = styled.p`
  font-size: 0.95rem;
  color: #4CC9F0;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const FullDescription = styled.p`
  font-size: 0.9rem;
  color: #b0b0b0;
  font-style: italic;
`;

const SelectButton = styled.button`
  background: linear-gradient(45deg, #F72585, #4CC9F0);
  color: #fff;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  font-family: 'Roboto', sans-serif;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(76, 201, 240, 0.7);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Particle = styled.div`
  position: absolute;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  pointer-events: none;
`;

const CharacterSelect = () => {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Card appearance animations
    characters.forEach((character, index) => {
      const card = cardRefs.current[index];
      if (!card) return;

      switch (character.animation) {
        case 'blaze':
          gsap.fromTo(
            card,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              ease: 'back.out(1.7)',
              onStart: () => {
                // Spark effect
                gsap.to(card, {
                  boxShadow: `0 0 20px ${character.glowColor}`,
                  duration: 0.3,
                  repeat: 3,
                  yoyo: true,
                });
                // Camera shake
                gsap.to(containerRef.current, {
                  x: '+=5',
                  y: '+=5',
                  duration: 0.1,
                  repeat: 5,
                  yoyo: true,
                });
              },
            }
          );
          break;
        case 'shadow':
          gsap.fromTo(
            card,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power2.out',
              onStart: () => {
                // Pulse effect
                gsap.to(card, {
                  scale: 1.05,
                  duration: 0.5,
                  repeat: 2,
                  yoyo: true,
                  ease: 'sine.inOut',
                });
              },
            }
          );
          break;
        case 'nova':
          gsap.fromTo(
            card,
            { rotation: 360, opacity: 0, y: -100 },
            {
              rotation: 0,
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'elastic.out(1, 0.5)',
              onStart: () => {
                // Color flash
                gsap.to(card, {
                  boxShadow: `0 0 30px ${character.glowColor}`,
                  duration: 0.4,
                  repeat: 2,
                  yoyo: true,
                });
              },
            }
          );
          break;
        default:
          break;
      }
    });

    // Air particles
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      containerRef.current.appendChild(particle);

      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      gsap.set(particle, { x, y });
      gsap.to(particle, {
        x: x + (Math.random() - 0.5) * 200,
        y: y + (Math.random() - 0.5) * 200,
        opacity: 0,
        scale: 0,
        duration: Math.random() * 2 + 1,
        ease: 'power1.out',
        onComplete: () => {
          particle.remove();
        },
      });
    };

    const particleInterval = setInterval(createParticle, 200);
    return () => clearInterval(particleInterval);
  }, []);

  const handleHover = (index) => {
    const card = cardRefs.current[index];
    gsap.to(card, {
      scale: 1.03,
      boxShadow: `0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px ${characters[index].glowColor}`,
      duration: 0.4,
      ease: 'power2.out',
    });
    switch (characters[index].animation) {
      case 'blaze':
        gsap.to(card.querySelector('img'), {
          scale: 1.15,
          rotation: 8,
          duration: 0.4,
          ease: 'power2.out',
        });
        break;
      case 'shadow':
        gsap.to(card.querySelector('img'), {
          x: -12,
          opacity: 0.85,
          duration: 0.4,
          ease: 'sine.inOut',
          repeat: 1,
          yoyo: true,
        });
        break;
      case 'nova':
        gsap.to(card.querySelector('img'), {
          y: -25,
          rotation: -6,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)',
        });
        break;
      default:
        break;
    }
  };

  const handleLeave = (index) => {
    const card = cardRefs.current[index];
    gsap.to(card, {
      scale: 1,
      boxShadow: `0 4px 15px rgba(0, 0, 0, 0.3), 0 0 10px ${characters[index].glowColor}`,
      duration: 0.4,
      ease: 'power2.out',
    });
    gsap.to(card.querySelector('img'), {
      scale: 1,
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleSelect = (characterName) => {
    // Transition animation
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        navigate('/game');
      },
    });

    // Explosive effect
    gsap.to(containerRef.current, {
      boxShadow: '0 0 50px rgba(247, 37, 133, 0.8)',
      duration: 0.2,
      repeat: 2,
      yoyo: true,
    });
  };

  return (
    <ImageContainer ref={containerRef} className="character-select">
      <Title>🛹 CHOOSE YOUR HERO</Title>
      <Subtitle>SkateNova awaits! Pick your street legend!</Subtitle>
      <Subtitle>Three skate warriors are ready to conquer the track. Who are you in this world of speed?</Subtitle>

      <CharactersGrid>
        {characters.map((character, index) => (
          <CharacterCard
            key={character.name}
            ref={(el) => (cardRefs.current[index] = el)}
            bgGradient={character.bgGradient}
            glowColor={character.glowColor}
            onMouseEnter={() => handleHover(index)}
            onMouseLeave={() => handleLeave(index)}
          >
            <CharacterImage src={character.image} alt={character.name} />
            <CharacterName>
              {character.emoji} {character.name}
            </CharacterName>
            <CharacterDescription>{character.description}</CharacterDescription>
            <CharacterSkill>Skill: {character.skill}</CharacterSkill>
            <FullDescription>{character.fullDescription}</FullDescription>
            <SelectButton onClick={() => handleSelect(character.name)}>
              Select
            </SelectButton>
          </CharacterCard>
        ))}
      </CharactersGrid>
    </ImageContainer>
  );
};

export default CharacterSelect;