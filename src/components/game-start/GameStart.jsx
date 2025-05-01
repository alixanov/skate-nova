import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { useLocation, useNavigate } from 'react-router-dom';
import blazeImg from '../../assets/1.png';
import shadowImg from '../../assets/2.png';
import novaImg from '../../assets/3.png';
import good1 from '../../assets/good1.png';
import good2 from '../../assets/good2.png';
import good3 from '../../assets/good3.png';
import bad1 from '../../assets/bad1.png';
import bad2 from '../../assets/bad2.png';
import bad3 from '../../assets/bad3.png';
import soundskateboard from '../../sound/ezda-na-skeytborde-35270.mp3';
import soundSucces from '../../sound/success_bell-6776.mp3';
import soundError from '../../sound/defeated-sigh-85637.mp3';
import victory from '../../sound/piglevelwin2mp3-14800.mp3';
import defeats from '../../sound/marcha-funebre-8-bits-260615.mp3';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const characters = {
  Blaze: { image: blazeImg, speed: 8, jumpPower: 15, skill: 'speedBoost' },
  Shadow: { image: shadowImg, speed: 6, jumpPower: 12, skill: 'stealth' },
  Nova: { image: novaImg, speed: 7, jumpPower: 18, skill: 'trickBonus' },
};

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to bottom, #1a1a2e, #16213e);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  font-family: 'JetBrains Mono', monospace;
  touch-action: manipulation;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  touch-action: none;
`;

const CityBackground = styled.div`
  position: absolute;
  width: 400%;
  height: 100%;
  background: url('https://images.unsplash.com/photo-1557761469-f29c6e201784?q=80&w=2049&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') repeat-x;
  background-size: auto 100%;
  z-index: 0;
  background-blend-mode: multiply;
  background-color: rgba(22, 33, 62, 0.8);
  filter: brightness(0.7) contrast(1.2);
`;

const Road = styled.div`
  position: absolute;
  bottom: 0;
  width: 400%;
  height: 100px;
  background: linear-gradient(to bottom, #444, #222);
  z-index: 1;
`;

const RoadLines = styled.div`
  position: absolute;
  bottom: 50px;
  width: 400%;
  height: 4px;
  background: repeating-linear-gradient(
    to right,
    #fff,
    #fff 50px,
    transparent 50px,
    transparent 100px
  );
  z-index: 2;
`;

const ScoreDisplay = styled.div`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 2rem;
  text-shadow: 0 0 15px rgba(76, 201, 240, 0.8);
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border-radius: 10px;
  border: 2px solid #4CC9F0;
  box-shadow: 0 0 20px rgba(76, 201, 240, 0.5);
  z-index: 10;
  font-family: 'JetBrains Mono', monospace;
`;

const StageDisplay = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  color: #fff;
  font-size: 1.4rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.5);
  padding: 12px;
  border-radius: 8px;
  z-index: 10;
  font-family: 'JetBrains Mono', monospace;
`;

const StageCompleteMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #4CC9F0;
  font-size: 2rem;
  text-align: center;
  text-shadow: 0 0 10px rgba(76, 201, 240, 0.8);
  opacity: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 10px;
  border: 2px solid #4CC9F0;
  box-shadow: 0 0 30px rgba(76, 201, 240, 0.7);
  z-index: 20;
  font-family: 'JetBrains Mono', monospace;
`;

const GameOverMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #FF006E;
  font-size: 3rem;
  text-shadow: 0 0 15px rgba(255, 0, 110, 0.8);
  opacity: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 10px;
  z-index: 20;
  font-family: 'JetBrains Mono', monospace;
`;

const LevelCompleteMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #4CC9F0;
  font-size: 2.5rem;
  text-align: center;
  text-shadow: 0 0 10px rgba(76, 201, 240, 0.8);
  opacity: 0;
  background: rgba(0, 0, 0, 0.85);
  padding: 25px;
  border-radius: 10px;
  border: 3px solid #4CC9F0;
  box-shadow: 0 0 30px rgba(76, 201, 240, 0.7);
  z-index: 30;
  width: 80%;
  max-width: 500px;
  font-family: 'JetBrains Mono', monospace;
`;

const SkateboardImage = styled.div`
  width: 120px;
  height: 40px;
  background-color: #4CC9F0;
  border-radius: 10px;
  position: relative;
  margin: 20px auto;
  box-shadow: 0 0 15px rgba(76, 201, 240, 0.8);
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 30px;
    height: 15px;
    background-color: #333;
    border-radius: 5px;
    bottom: -8px;
  }
  
  &:before {
    left: 15px;
  }
  
  &:after {
    right: 15px;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
  z-index: 15;
`;

const GameButton = styled.button`
  background: linear-gradient(45deg, rgb(8, 8, 8), #00B7EB);
  color: #F0F4FF;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  box-shadow: 0 0 10px rgba(76, 201, 240, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(76, 201, 240, 0.7);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 600px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

const elixirImageCache = {};

const SkateNovaGame = () => {
  const canvasRef = useRef(null);
  const cityRef = useRef(null);
  const roadRef = useRef(null);
  const roadLinesRef = useRef(null);
  const scoreRef = useRef(null);
  const stageRef = useRef(null);
  const stageCompleteRef = useRef(null);
  const gameOverRef = useRef(null);
  const levelCompleteRef = useRef(null);
  const playerImageRef = useRef(null);
  const [score, setScore] = useState(0);
  const [stage, setStage] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [stageScores, setStageScores] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0); // Key to force component remount
  const location = useLocation();
  const navigate = useNavigate();
  const characterName = new URLSearchParams(location.search).get('character') || 'Blaze';
  const character = characters[characterName] || characters.Blaze;
  const backgroundTween = useRef(null);
  const elixirIntervalRef = useRef(null);
  const stageTimerRef = useRef(null);

  // Prevent scrolling on mobile devices
  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.removeEventListener('touchmove', preventDefault);
    };
  }, []);

  // Audio refs
  const audioRefs = {
    skateboard: useRef(new Audio(soundskateboard)),
    success: useRef(new Audio(soundSucces)),
    error: useRef(new Audio(soundError)),
    victory: useRef(new Audio(victory)),
    defeat: useRef(new Audio(defeats)),
  };

  useEffect(() => {
    const initAudio = () => {
      Object.values(audioRefs).forEach(ref => {
        if (ref.current) {
          ref.current.volume = 0.5;
          ref.current.preload = 'auto';
          ref.current.loop = ref.current === audioRefs.skateboard.current;
        }
      });
    };

    const handleUserInteraction = () => {
      if (!userInteracted) {
        setUserInteracted(true);
        initAudio();
        const silentSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...');
        silentSound.volume = 0;
        silentSound.play().then(() => silentSound.remove()).catch(e => console.log('Audio init error:', e));
      }
    };

    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('keydown', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [userInteracted]);

  const playSound = (soundName) => {
    if (!userInteracted) return;
    try {
      const sound = audioRefs[soundName].current;
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Sound play error:', e));
      }
    } catch (e) {
      console.log('Sound error:', e);
    }
  };

  const stopSound = (soundName) => {
    try {
      const sound = audioRefs[soundName].current;
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    } catch (e) {
      console.log('Sound stop error:', e);
    }
  };

  const resetGame = () => {
    // Pause game
    setPaused(true);
    if (backgroundTween.current) {
      backgroundTween.current.kill();
    }
    // Clear intervals
    if (elixirIntervalRef.current) {
      clearInterval(elixirIntervalRef.current);
    }
    if (stageTimerRef.current) {
      clearInterval(stageTimerRef.current);
    }
    // Stop all sounds
    stopSound('skateboard');
    stopSound('victory');
    stopSound('defeat');
    // Reset all states
    setScore(0);
    setStage(1);
    setTimeLeft(60);
    setStageScores([]);
    setFinalScore(0);
    setPaused(false);
    // Force component remount by changing key
    setResetKey(prev => prev + 1);
  };

  const goToMainPage = () => {
    setPaused(true);
    if (backgroundTween.current) {
      backgroundTween.current.kill();
    }
    if (elixirIntervalRef.current) {
      clearInterval(elixirIntervalRef.current);
    }
    if (stageTimerRef.current) {
      clearInterval(stageTimerRef.current);
    }
    stopSound('skateboard');
    stopSound('victory');
    stopSound('defeat');
    navigate('/');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const city = cityRef.current;
    const road = roadRef.current;
    const roadLines = roadLinesRef.current;

    const preloadImage = () => {
      const img = new Image();
      img.src = character.image;
      img.onload = () => {
        playerImageRef.current = img;
      };
      img.onerror = () => {
        console.error(`Failed to load character image: ${character.image}`);
        playerImageRef.current = null;
      };
    };
    preloadImage();

    const preloadElixirImages = () => {
      const elixirImages = [good1, good2, good3, bad1, bad2, bad3];
      elixirImages.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          elixirImageCache[src] = img;
        };
      });
    };
    preloadElixirImages();

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (road) {
        road.style.height = '100px';
        road.style.bottom = '0';
      }
      if (roadLines) {
        roadLines.style.bottom = '50px';
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let player = {
      x: 100,
      y: canvas.height - 100 - 180, // Adjusted for new height
      width: 120, // Increased from 100
      height: 180, // Increased from 150
      speed: character.speed,
      dx: 0,
      dy: 0,
      jumping: false,
    };

    let elixirs = [];
    let gameOver = false;
    let stageComplete = false;
    let levelComplete = false;
    let baseTrackSpeed = 3;
    const scoreThreshold = 100;

    const elixirTypes = [
      {
        image: good1,
        points: 10,
        type: 'good',
        name: 'Speed Elixir',
        effect: 'Speed +10%',
        width: 50,
        height: 50,
      },
      {
        image: good2,
        points: 20,
        type: 'good',
        name: 'Power Elixir',
        effect: 'Score +20',
        width: 50,
        height: 50,
      },
      {
        image: good3,
        points: 15,
        type: 'good',
        name: 'Jump Elixir',
        effect: 'Jump +15%',
        width: 50,
        height: 50,
      },
      {
        image: bad1,
        points: -5,
        type: 'bad',
        name: 'Slow Poison',
        effect: 'Speed -5%',
        width: 50,
        height: 50,
      },
      {
        image: bad2,
        points: -10,
        type: 'bad',
        name: 'Weak Poison',
        effect: 'Score -10',
        width: 50,
        height: 50,
      },
      {
        image: bad3,
        points: -15,
        type: 'bad',
        name: 'Heavy Poison',
        effect: 'Jump -15%',
        width: 50,
        height: 50,
      },
    ];

    const startBackgroundAnimation = () => {
      if (backgroundTween.current) {
        backgroundTween.current.kill();
      }
      city.style.left = '0';
      road.style.left = '0';
      roadLines.style.left = '0';
      backgroundTween.current = gsap.to([city, road, roadLines], {
        x: '-75%',
        duration: 20 / (baseTrackSpeed / 3),
        ease: 'linear',
        repeat: -1,
        onUpdate: () => {
          const currentX = gsap.getProperty(city, 'x');
          if (currentX <= -window.innerWidth * 2) {
            gsap.set([city, road, roadLines], { x: 0 });
          }
        },
      });
    };

    const updateBackgroundSpeed = () => {
      if (backgroundTween.current) {
        backgroundTween.current.timeScale(baseTrackSpeed / 3);
      }
    };

    const spawnElixir = () => {
      if (gameOver || stageComplete || levelComplete || paused) return;
      const goodProbability = 0.7 - stage * 0.1;
      const isGoodElixir = Math.random() < goodProbability;
      const availableElixirs = elixirTypes.filter(e => (isGoodElixir ? e.type === 'good' : e.type === 'bad'));
      const elixir = availableElixirs[Math.floor(Math.random() * availableElixirs.length)];
      const minHeight = canvas.height - 140;
      const maxHeight = canvas.height - 300;
      const y = minHeight - Math.random() * (minHeight - maxHeight);
      elixirs.push({
        x: canvas.width + Math.random() * 500,
        y,
        width: elixir.width,
        height: elixir.height,
        image: elixir.image,
        points: elixir.points,
        name: elixir.name,
        effect: elixir.effect,
        type: elixir.type,
        rotation: 0,
        scale: 1,
        opacity: 1,
      });
    };

    elixirIntervalRef.current = setInterval(() => {
      if (Math.random() < 0.3 + stage * 0.1) {
        spawnElixir();
      }
    }, 1000 - stage * 100);

    stageTimerRef.current = setInterval(() => {
      if (paused) return;
      setTimeLeft(prev => {
        if (prev <= 0 && !gameOver && !levelComplete) {
          if (score >= scoreThreshold) {
            if (stage < 3) {
              completeStage();
            } else {
              completeFinalLevel();
            }
          } else {
            triggerGameOver();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleKeyDown = e => {
      if (gameOver || stageComplete || levelComplete || paused) return;
      if (e.key === 'ArrowLeft') {
        player.dx = -player.speed;
        playSound('skateboard');
      }
      if (e.key === 'ArrowRight') {
        player.dx = player.speed;
        playSound('skateboard');
      }
      if (e.key === 'ArrowUp' && !player.jumping) {
        player.dy = -character.jumpPower;
        player.jumping = true;
        playSound('skateboard');
      }
    };

    const handleKeyUp = e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        player.dx = 0;
        stopSound('skateboard');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let touchStartX = 0;
    let isMoving = false;

    const handleTouchStart = e => {
      if (gameOver || stageComplete || levelComplete || paused) return;
      e.preventDefault();
      touchStartX = e.touches[0].clientX;
      isMoving = false;
    };

    const handleTouchMove = e => {
      if (gameOver || stageComplete || levelComplete || paused) return;
      e.preventDefault();
      const touchX = e.touches[0].clientX;
      player.dx = touchX > touchStartX ? player.speed : -player.speed;
      if (!isMoving) {
        playSound('skateboard');
        isMoving = true;
      }
    };

    const handleTouchEnd = () => {
      player.dx = 0;
      stopSound('skateboard');
      isMoving = false;
    };

    const handleTouchJump = e => {
      if (gameOver || stageComplete || levelComplete || paused || player.jumping) return;
      e.preventDefault();
      player.dy = -character.jumpPower;
      player.jumping = true;
      playSound('skateboard');
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('click', handleTouchJump);

    const showPointPopup = (points, x, y) => {
      const popup = document.createElement('div');
      popup.style.position = 'absolute';
      popup.style.left = `${x}px`;
      popup.style.top = `${y}px`;
      popup.style.color = points > 0 ? '#4CC9F0' : '#FF006E';
      popup.style.fontSize = '1.2rem';
      popup.style.fontWeight = 'bold';
      popup.style.textShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
      popup.style.padding = '3px 8px';
      popup.style.borderRadius = '4px';
      popup.style.minWidth = '40px';
      popup.style.textAlign = 'center';
      popup.style.fontFamily = 'JetBrains Mono, monospace';
      popup.style.zIndex = '15';
      popup.style.pointerEvents = 'none';
      popup.style.opacity = '0';
      popup.style.transition = 'all 0.3s ease-out';
      popup.style.background = points > 0 ? 'rgba(76, 201, 240, 0.2)' : 'rgba(255, 0, 110, 0.2)';
      popup.style.border = `1px solid ${points > 0 ? 'rgba(76, 201, 240, 0.5)' : 'rgba(255, 0, 110, 0.5)'}`;
      popup.textContent = `${points > 0 ? '+' : ''}${points}`;
      document.body.appendChild(popup);
      gsap.to(popup, {
        opacity: 1,
        y: -20,
        duration: 0.3,
        ease: 'power1.out',
        onComplete: () => {
          gsap.to(popup, {
            opacity: 0,
            y: -40,
            duration: 0.4,
            delay: 0.2,
            ease: 'power1.in',
            onComplete: () => {
              document.body.removeChild(popup);
            },
          });
        },
      });
    };

    const completeStage = () => {
      stageComplete = true;
      playSound('victory');
      stopSound('skateboard');
      if (backgroundTween.current) {
        backgroundTween.current.pause();
      }
      gsap.to(stageCompleteRef.current, {
        opacity: 1,
        scale: 1.1,
        duration: 0.5,
        onStart: () => {
          gsap.to(canvasRef.current, {
            boxShadow: '0 0 30px rgba(76, 201, 240, 0.7)',
            duration: 0.3,
            repeat: 3,
            yoyo: true,
          });
          gsap.to(scoreRef.current, {
            scale: 1.3,
            duration: 0.4,
            repeat: 2,
            yoyo: true,
          });
        },
      });
      setTimeout(() => {
        setStageScores(prev => [...prev, score]);
        gsap.to(stageCompleteRef.current, {
          opacity: 0,
          scale: 1,
          onComplete: () => {
            setStage(prev => prev + 1);
            setTimeLeft(stage === 1 ? 120 : 180);
            setScore(0);
            player.x = 100;
            player.y = canvas.height - 100 - player.height;
            player.dx = 0;
            player.dy = 0;
            player.jumping = false;
            elixirs = [];
            baseTrackSpeed += 0.5;
            updateBackgroundSpeed();
            stageComplete = false;
            setPaused(false);
            startBackgroundAnimation();
          },
        });
      }, 4000);
    };

    const completeFinalLevel = () => {
      levelComplete = true;
      playSound('victory');
      stopSound('skateboard');
      if (backgroundTween.current) {
        backgroundTween.current.pause();
      }
      const totalScore = stageScores.reduce((sum, s) => sum + s, 0) + score;
      setFinalScore(totalScore);
      const levelCompleteElement = levelCompleteRef.current;
      if (levelCompleteElement) {
        levelCompleteElement.innerHTML = `
          <h2>🏆 LEVEL 3 COMPLETE! 🏆</h2>
          <p>You've mastered all stages!</p>
          <p><strong>TOTAL SCORE: ${totalScore}</strong></p>
          <p>🔥 Amazing performance! 🔥</p>
          <div id="skateboard-image"></div>
        `;
        gsap.to(levelCompleteElement, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)',
          onStart: () => {
            createParticles();
            gsap.to(canvasRef.current, {
              boxShadow: '0 0 40px rgba(76, 201, 240, 0.8)',
              duration: 0.4,
              repeat: 2,
              yoyo: true,
            });
          },
        });
      }
    };

    const createParticles = () => {
      const particleCount = 30;
      const colors = ['#4CC9F0', '#F72585', '#7209B7', '#3A0CA3', '#4361EE'];
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 8 + 4}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.top = '50%';
        particle.style.left = '50%';
        particle.style.transform = 'translate(-50%, -50%)';
        particle.style.zIndex = '25';
        document.body.appendChild(particle);
        gsap.to(particle, {
          x: (Math.random() - 0.5) * window.innerWidth * 0.6,
          y: (Math.random() - 0.5) * window.innerHeight * 0.6,
          opacity: 0,
          duration: Math.random() * 1.5 + 0.5,
          ease: 'power2.out',
          onComplete: () => {
            document.body.removeChild(particle);
          },
        });
      }
    };

    const triggerGameOver = () => {
      gameOver = true;
      playSound('defeat');
      stopSound('skateboard');
      if (backgroundTween.current) {
        backgroundTween.current.pause();
      }
      gsap.to(gameOverRef.current, {
        opacity: 1,
        scale: 1.1,
        duration: 0.5,
        onComplete: () => {
          setTimeout(() => {
            gsap.to(gameOverRef.current, { opacity: 0, scale: 1 });
            resetGame();
          }, 2000);
        },
      });
    };

    const update = () => {
      if (gameOver || stageComplete || levelComplete || paused) {
        return requestAnimationFrame(update);
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(player.x + player.width / 2, canvas.height - 100, player.width / 2, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      player.x += player.dx;
      player.y += player.dy;
      player.dy += 0.5;
      if (player.y > canvas.height - 100 - player.height) {
        player.y = canvas.height - 100 - player.height;
        player.dy = 0;
        player.jumping = false;
      }
      if (player.x < 0) player.x = 0;
      if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
      if (playerImageRef.current) {
        ctx.drawImage(playerImageRef.current, player.x, player.y, player.width, player.height);
      } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(player.x, player.y, player.width, player.height);
      }
      elixirs.forEach((elixir, i) => {
        elixir.x -= baseTrackSpeed;
        elixir.rotation += 0.02;
        if (elixir.x + elixir.width < 0) {
          elixirs.splice(i, 1);
          return;
        }
        ctx.save();
        ctx.translate(elixir.x + elixir.width / 2, elixir.y + elixir.height / 2);
        ctx.rotate(elixir.rotation);
        ctx.globalAlpha = elixir.opacity;
        if (elixirImageCache[elixir.image]) {
          ctx.drawImage(elixirImageCache[elixir.image], -elixir.width / 2, -elixir.height / 2, elixir.width * elixir.scale, elixir.height * elixir.scale);
        }
        ctx.restore();
        if (
          player.x < elixir.x + elixir.width &&
          player.x + player.width > elixir.x &&
          player.y < elixir.y + elixir.height &&
          player.y + player.height > elixir.y
        ) {
          elixir.opacity = 0;
          if (elixir.type === 'good') {
            playSound('success');
          } else {
            playSound('error');
          }
          elixirs.splice(i, 1);
          setScore(prev => {
            const newScore = Math.max(0, prev + elixir.points);
            showPointPopup(elixir.points, player.x + player.width, player.y);
            if (newScore >= scoreThreshold && timeLeft > 0) {
              if (stage < 3) {
                completeStage();
              } else {
                completeFinalLevel();
              }
            }
            return newScore;
          });
          if (elixir.type === 'good') {
            gsap.to(scoreRef.current, {
              scale: 1.2,
              color: '#4CC9F0',
              duration: 0.15,
              yoyo: true,
              repeat: 1,
            });
          } else {
            gsap.to(scoreRef.current, {
              scale: 0.95,
              color: '#FF006E',
              duration: 0.15,
              yoyo: true,
              repeat: 1,
            });
          }
          if (elixir.type === 'bad') {
            gsap.to(canvasRef.current, {
              x: 2,
              duration: 0.08,
              yoyo: true,
              repeat: 1,
              ease: 'power2.inOut',
            });
          } else {
            gsap.to(canvasRef.current, {
              boxShadow: '0 0 10px rgba(76, 201, 240, 0.5)',
              duration: 0.15,
              yoyo: true,
              repeat: 1,
            });
          }
        }
      });
      requestAnimationFrame(update);
    };

    startBackgroundAnimation();
    update();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('click', handleTouchJump);
      if (elixirIntervalRef.current) {
        clearInterval(elixirIntervalRef.current);
      }
      if (stageTimerRef.current) {
        clearInterval(stageTimerRef.current);
      }
      stopSound('skateboard');
      if (backgroundTween.current) {
        backgroundTween.current.kill();
      }
    };
  }, [character, stage, userInteracted, navigate, characterName, resetKey]);

  return (
    <GameContainer key={resetKey}>
      <ButtonContainer>
        <ChevronLeftIcon
          onClick={goToMainPage}
          sx={{ color: 'white', fontSize: 45 }}
        />
        <GameButton onClick={resetGame}>Play Again</GameButton>
      </ButtonContainer>
      <CityBackground ref={cityRef} />
      <Road ref={roadRef} />
      <RoadLines ref={roadLinesRef} />
      <ScoreDisplay ref={scoreRef}>Score: {score}</ScoreDisplay>
      <StageDisplay ref={stageRef}>
        Stage {stage} - Time: {timeLeft}s
      </StageDisplay>
      <StageCompleteMessage ref={stageCompleteRef}>
        Stage {stage} Complete!<br />
        Score: {score}<br />
        {stage < 3 ? 'Preparing next stage...' : 'Final results coming up!'}
      </StageCompleteMessage>
      <GameOverMessage ref={gameOverRef}>Game Over!</GameOverMessage>
      <LevelCompleteMessage ref={levelCompleteRef}></LevelCompleteMessage>
      <Canvas ref={canvasRef} />
    </GameContainer>
  );
};

export default SkateNovaGame;