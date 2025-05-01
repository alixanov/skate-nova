import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import blaze from '../../assets/1.png'; // Предполагается, что изображения обновлены
import shadow from '../../assets/2.png';
import nova from '../../assets/3.png';

const characters = [
  {
    name: 'Blaze',
    description: 'Пламя улиц. Скорость — его стихия.',
    fullDescription: 'Пролетает мимо, оставляя искры. Огонь в глазах, дерзость в движениях.',
    skill: 'Мгновенный буст скорости и эффектный старт.',
    image: blaze,
    emoji: '🔥',
    animation: 'blaze',
  },
  {
    name: 'Shadow',
    description: 'Тень мегаполиса. Неуловим и точен.',
    fullDescription: 'Скользит как призрак. Тихий, как ночь, опасный, как поворот.',
    skill: 'Улучшенное управление и скрытность.',
    image: shadow,
    emoji: '🌌',
    animation: 'shadow',
  },
  {
    name: 'Nova',
    description: 'Городская звезда. Икона трюков.',
    fullDescription: 'Танцует на трассе. Фонтаны света и бит под колёсами.',
    skill: 'Бонус к очкам за трюки и комбо.',
    image: nova,
    emoji: '🌟',
    animation: 'nova',
  },
];

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #ff007a;
  text-shadow: 0 0 10px rgba(255, 0, 122, 0.8);
  margin-bottom: 1rem;
  text-align: center;
  font-family: 'Orbitron', sans-serif;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #e0e0e0;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
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
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(255, 0, 122, 0.3);
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
  transition: transform 0.3s ease;
`;

const CharacterName = styled.h3`
  font-size: 1.8rem;
  color: #fff;
  text-shadow: 0 0 8px rgba(255, 0, 122, 0.6);
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
  color: #ff007a;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const FullDescription = styled.p`
  font-size: 0.9rem;
  color: #b0b0b0;
  font-style: italic;
`;

const SelectButton = styled.button`
  background: linear-gradient(45deg, #ff007a, #ff4d00);
  color: #fff;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  font-family: 'Roboto', sans-serif;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(255, 0, 122, 0.5);
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

  useEffect(() => {
    // Анимация появления карточек
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
                // Эффект искр
                gsap.to(card, {
                  boxShadow: '0 0 20px rgba(255, 100, 0, 0.8)',
                  duration: 0.3,
                  repeat: 3,
                  yoyo: true,
                });
                // Дрожание камеры
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
                // Пульсация
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
                // Вспышка цвета
                gsap.to(card, {
                  boxShadow: '0 0 30px rgba(255, 0, 255, 0.8)',
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

    // Частицы воздуха
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
    switch (characters[index].animation) {
      case 'blaze':
        gsap.to(card.querySelector('img'), {
          scale: 1.1,
          rotation: 10,
          duration: 0.3,
          ease: 'power2.out',
        });
        break;
      case 'shadow':
        gsap.to(card.querySelector('img'), {
          x: -10,
          opacity: 0.8,
          duration: 0.4,
          ease: 'sine.inOut',
          repeat: 1,
          yoyo: true,
        });
        break;
      case 'nova':
        gsap.to(card.querySelector('img'), {
          y: -20,
          rotation: -5,
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
    gsap.to(card.querySelector('img'), {
      scale: 1,
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleSelect = (characterName) => {
    // Анимация перехода
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        alert(`Вы выбрали ${characterName}! Готовы зажечь трассу?`);
        // Здесь можно добавить реальный переход на уровень
      },
    });

    // Взрывной эффект
    gsap.to(containerRef.current, {
      boxShadow: '0 0 50px rgba(255, 0, 122, 0.8)',
      duration: 0.2,
      repeat: 2,
      yoyo: true,
    });
  };

  return (
    <ImageContainer ref={containerRef} className="character-select">
      <Title>🛹 ВЫБЕРИ СВОЕГО ГЕРОЯ</Title>
      <Subtitle>SkateNova зовёт! Выбери, кто станет легендой улиц!</Subtitle>
      <Subtitle>Трое скейт-воинов готовы покорить трассу. Кто ты в этом мире скорости?</Subtitle>

      <CharactersGrid>
        {characters.map((character, index) => (
          <CharacterCard
            key={character.name}
            ref={(el) => (cardRefs.current[index] = el)}
            onMouseEnter={() => handleHover(index)}
            onMouseLeave={() => handleLeave(index)}
          >
            <CharacterImage src={character.image} alt={character.name} />
            <CharacterName>
              {character.emoji} {character.name}
            </CharacterName>
            <CharacterDescription>{character.description}</CharacterDescription>
            <CharacterSkill>Скилл: {character.skill}</CharacterSkill>
            <FullDescription>{character.fullDescription}</FullDescription>
            <SelectButton onClick={() => handleSelect(character.name)}>
              Выбрать
            </SelectButton>
          </CharacterCard>
        ))}
      </CharactersGrid>
    </ImageContainer>
  );
};

export default CharacterSelect;