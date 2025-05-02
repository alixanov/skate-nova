import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import blaze from '../../assets/1.png';
import shadow from '../../assets/2.png';
import nova from '../../assets/3.png';
import personaj from "../../assets/personaj.jpg";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const characters = [
  {
    name: 'Blaze',
    description: 'Street Flame. Speed is his element.',
    fullDescription: 'Flies by, leaving sparks. Fire in his eyes, audacity in his moves.',
    skill: 'Instant speed boost and spectacular start.',
    image: blaze,
    emoji: '🔥',
    animation: 'blaze',
    bgGradient: 'linear-gradient(135deg, #FF416C 0%, #FF9900 100%)',
    glowColor: 'rgba(255, 65, 108, 0.7)',
    cornerColor: '#FF9900',
    isLocked: false,
    statusBadge: 'READY'
  },
  {
    name: 'Shadow',
    description: 'Metropolis Shadow. Elusive and precise.',
    fullDescription: 'Glides like a ghost. Quiet as night, dangerous as a turn.',
    skill: 'Enhanced control and stealth.',
    image: shadow,
    emoji: '🌌',
    animation: 'shadow',
    bgGradient: 'linear-gradient(135deg, #303F9F 0%, #00C9FF 100%)',
    glowColor: 'rgba(0, 201, 255, 0.7)',
    cornerColor: '#7F00FF',
    isLocked: true,
    statusBadge: 'LOCKED'
  },
  {
    name: 'Nova',
    description: 'Urban Star. Trick icon.',
    fullDescription: 'Dances on the track. Fountains of light and beats under the wheels.',
    skill: 'Trick points and combo bonus.',
    image: nova,
    emoji: '🌟',
    animation: 'nova',
    bgGradient: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
    glowColor: 'rgba(252, 176, 69, 0.7)',
    cornerColor: '#fd1d1d',
    isLocked: true,
    statusBadge: 'LOCKED'
  },
];

const CharacterSelect = () => {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const goToMainPage = () => {
    navigate('/');
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < 40; i++) {
      const element = document.createElement('div');
      element.className = 'bg-element';
      const size = Math.random() * 100 + 50;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const duration = Math.random() * 50 + 30;
      const delay = Math.random() * -50;

      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.left = `${posX}%`;
      element.style.top = `${posY}%`;
      element.style.opacity = Math.random() * 0.3;
      element.style.position = 'absolute';
      element.style.borderRadius = '50%';
      element.style.background = `radial-gradient(circle, ${['rgba(255,65,108,0.3)', 'rgba(0,201,255,0.3)', 'rgba(252,176,69,0.3)'][Math.floor(Math.random() * 3)]} 0%, transparent 70%)`;
      element.style.filter = 'blur(8px)';
      element.style.animation = `float ${duration}s ${delay}s infinite linear`;
      element.style.zIndex = '0';

      container.appendChild(element);
    }

    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
      @keyframes float {
        0% { transform: translate(0, 0) rotate(0); }
        25% { transform: translate(100px, 100px) rotate(90deg); }
        50% { transform: translate(0, 200px) rotate(180deg); }
        75% { transform: translate(-100px, 100px) rotate(270deg); }
        100% { transform: translate(0, 0) rotate(360deg); }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-3px, 3px); }
        40% { transform: translate(-3px, -3px); }
        60% { transform: translate(3px, 3px); }
        80% { transform: translate(3px, -3px); }
        100% { transform: translate(0); }
      }
      
      @keyframes neon-border {
        0%, 100% { box-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor; }
        50% { box-shadow: 0 0 15px currentColor, 0 0 25px currentColor, 0 0 40px currentColor; }
      }
    `;
    document.head.appendChild(styleSheet);

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      setTimeout(() => {
        card.style.opacity = characters[index].isLocked ? '0.7' : '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, index * 200);
    });

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleCardHover = (index) => {
    if (characters[index].isLocked) return;

    cardRefs.current.forEach((card, i) => {
      if (i !== index) {
        card.style.transform = 'scale(0.95)';
        card.style.opacity = '0.7';
      } else {
        card.style.transform = 'scale(1.05) translateY(-10px)';
        card.style.opacity = '1';
        const img = card.querySelector('.character-image');
        if (img) {
          img.style.transform = 'scale(1.1)';
        }
      }
    });
  };

  const handleCardLeave = () => {
    cardRefs.current.forEach((card, i) => {
      card.style.transform = 'scale(1)';
      card.style.opacity = characters[i].isLocked ? '0.7' : '1';
      const img = card.querySelector('.character-image');
      if (img) {
        img.style.transform = 'scale(1)';
      }
    });
  };

  const handleSelect = (characterName, index) => {
    if (characters[index].isLocked) return;

    setSelectedIndex(index);

    const card = cardRefs.current[index];
    if (card) {
      card.style.animation = 'pulse 0.6s ease infinite';

      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'energy-particle';

        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = characters[index].cornerColor;
        particle.style.boxShadow = `0 0 10px ${characters[index].cornerColor}`;
        particle.style.zIndex = '10';

        card.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const duration = Math.random() * 0.5 + 0.5;

        particle.animate([
          { transform: 'translate(0, 0) scale(0)', opacity: 1 },
          { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1)`, opacity: 0 }
        ], {
          duration: duration * 1000,
          easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        }).onfinish = () => particle.remove();
      }
    }

    setTimeout(() => {
      navigate(`/game?character=${characterName}`);
    }, 1000);
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        background: 'linear-gradient(135deg, #0F0F1F 0%, #1F1F3F 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 400
      }}
    >
      <ChevronLeftIcon
        onClick={goToMainPage}
        sx={{ color: 'white', fontSize: 45, position: 'absolute', top: '20px', left: '20px', zIndex: 100, cursor: 'pointer' }}
      />

      <div
        style={{
          position: 'relative',
          marginBottom: '3rem',
          textAlign: 'center'
        }}
      >
        <h1
          style={{
            fontSize: '3.5rem',
            fontWeight: 700,
            margin: '0',
            padding: '0',
            background: 'linear-gradient(to right, #FF416C, #FF9900, #00C9FF, #fcb045)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255, 255, 255, 0.2)',
            letterSpacing: '3px',
            transform: 'skew(-5deg)',
            fontFamily: "'JetBrains Mono', monospace"
          }}
        >
          🛹 SKATE NOVA 🛹
        </h1>
        <div
          style={{
            fontSize: '1.4rem',
            color: '#CCD6F6',
            opacity: '0.8',
            marginTop: '0.5rem',
            textShadow: '0 0 10px rgba(204, 214, 246, 0.5)',
            fontWeight: 400,
            fontFamily: "'JetBrains Mono', monospace"
          }}
        >
          CHOOSE YOUR LEGEND
        </div>

        <div
          style={{
            width: '100%',
            height: '3px',
            background: 'linear-gradient(to right, transparent, #FF416C, #00C9FF, transparent)',
            margin: '1.5rem 0',
            boxShadow: '0 0 10px rgba(255, 65, 108, 0.5)',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          width: '100%',
          maxWidth: '1200px',
          flexWrap: 'wrap',
          zIndex: '1'
        }}
      >
        {characters.map((character, index) => (
          <div
            key={character.name}
            ref={el => cardRefs.current[index] = el}
            style={{
              width: '320px',
              background: character.bgGradient,
              borderRadius: '20px',
              padding: '1rem',
              boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px ${character.glowColor}`,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              opacity: '0',
              transform: 'translateY(50px) scale(0.8)',
              border: `2px solid ${character.cornerColor}`,
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={() => handleCardHover(index)}
            onMouseLeave={handleCardLeave}
            onClick={() => handleSelect(character.name, index)}
          >
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: `radial-gradient(circle at top right, ${character.cornerColor}22, transparent 70%)`,
                zIndex: '0'
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: character.isLocked ? '#2A2A3A' : character.cornerColor,
                color: character.isLocked ? '#8A8A9A' : 'white',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '1px',
                zIndex: '10',
                boxShadow: character.isLocked ? 'none' : `0 0 10px ${character.cornerColor}`,
                border: `1px solid ${character.isLocked ? '#555' : character.cornerColor + '99'}`,
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              {character.statusBadge}
            </div>

            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '230px',
                margin: '0.5rem 0 1.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: '5'
              }}
            >
              <img
                src={character.image}
                alt={character.name}
                className="character-image"
                style={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  objectFit: 'contain',
                  borderRadius: '10px',
                  transition: 'transform 0.3s ease',
                  filter: character.isLocked ? 'grayscale(80%) brightness(0.7)' : `drop-shadow(0 0 10px ${character.glowColor})`
                }}
              />

              {character.isLocked && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '2rem',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                    zIndex: '10',
                    backdropFilter: 'blur(5px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                >
                  🔒
                </div>
              )}
            </div>

            <div style={{ zIndex: '5', position: 'relative' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.5rem'
                }}
              >
                <span style={{ fontSize: '1.5rem', marginRight: '0.5rem', fontFamily: "'JetBrains Mono', monospace" }}>{character.emoji}</span>
                <h2
                  style={{
                    margin: '0',
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    background: 'linear-gradient(to right, white, #CCD6F6)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                >
                  {character.name}
                </h2>
              </div>

              <div
                style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  textAlign: 'center',
                  marginBottom: '0.7rem',
                  fontWeight: 400,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                {character.description}
              </div>

              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  textAlign: 'center',
                  marginBottom: '0.7rem',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                {character.fullDescription}
              </div>

              <div
                style={{
                  background: `rgba(0, 0, 0, 0.3)`,
                  padding: '0.5rem',
                  borderRadius: '10px',
                  marginBottom: '1rem',
                  border: `1px solid ${character.cornerColor}40`,
                  backdropFilter: 'blur(5px)'
                }}
              >
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: character.cornerColor,
                    fontWeight: 600,
                    marginBottom: '0.3rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                >
                  SPECIAL SKILL
                </div>
                <div
                  style={{
                    fontSize: '0.9rem',
                    color: 'white',
                    fontWeight: 400,
                    textShadow: `0 0 5px ${character.glowColor}`,
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                >
                  {character.skill}
                </div>
              </div>
            </div>

            <button
              style={{
                width: '100%',
                padding: '0.8rem',
                background: character.isLocked
                  ? 'linear-gradient(to right, #333, #555)'
                  : `linear-gradient(to right, ${character.cornerColor}, ${character.glowColor.replace('0.7', '1')})`,
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: character.isLocked ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: character.isLocked
                  ? 'none'
                  : `0 5px 15px ${character.glowColor}`,
                opacity: character.isLocked ? 0.7 : 1,
                zIndex: '5',
                fontFamily: "'JetBrains Mono', monospace"
              }}
              disabled={character.isLocked}
              onClick={(e) => {
                e.stopPropagation();
                if (!character.isLocked) handleSelect(character.name, index);
              }}
            >
              {character.isLocked ? 'LOCKED' : 'SELECT'}

              {!character.isLocked && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-100%',
                    width: '50%',
                    height: '200%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'rotate(30deg)',
                    transition: 'left 0.7s ease'
                  }}
                />
              )}
            </button>

            {character.isLocked && (
              <div
                style={{
                  textAlign: 'center',
                  color: '#8A8A9A',
                  fontSize: '0.8rem',
                  marginTop: '0.5rem',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                Complete Stage 1 to unlock
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelect;