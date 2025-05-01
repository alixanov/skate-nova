import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom';
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

const characters = {
  Blaze: { image: blazeImg, speed: 8, jumpPower: 15, skill: 'speedBoost' },
  Shadow: { image: shadowImg, speed: 6, jumpPower: 12, skill: 'stealth' },
  Nova: { image: novaImg, speed: 7, jumpPower: 18, skill: 'trickBonus' },
};

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #1a1a2e;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  font-family: 'Orbitron', sans-serif;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.2);
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

// Cache for all elixir images to prevent flickering
const elixirImageCache = {};

const SkateNovaGame = () => {
  const canvasRef = useRef(null);
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
  const pointPopupsRef = useRef([]);
  const location = useLocation();
  const characterName = new URLSearchParams(location.search).get('character') || 'Blaze';
  const character = characters[characterName] || characters.Blaze;
  const skateboardSound = useRef(new Audio(soundskateboard));
  const successSound = useRef(new Audio(soundSucces));
  const errorSound = useRef(new Audio(soundError));
  const victorySound = useRef(new Audio(victory));
  const defeatSound = useRef(new Audio(defeats));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Preload the character image
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

    // Preload all elixir images
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
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let player = {
      x: 100,
      y: canvas.height - 100,
      width: 60,
      height: 90,
      speed: character.speed,
      dx: 0,
      dy: 0,
      jumping: false,
    };

    let elixirs = []; // Renamed from bonuses/obstacles to elixirs
    let pointPopups = [];
    let gameOver = false;
    let stageComplete = false;
    let levelComplete = false;
    let baseTrackSpeed = 3;
    const scoreThreshold = 100;

    // Define elixirs with clear point values and effects
    const elixirTypes = [
      // Good elixirs (bonuses)
      {
        image: good1,
        points: 10,
        type: 'good',
        name: 'Speed Elixir',
        effect: 'Speed +10%',
        width: 40,
        height: 50
      },
      {
        image: good2,
        points: 20,
        type: 'good',
        name: 'Power Elixir',
        effect: 'Score +20',
        width: 42,
        height: 48
      },
      {
        image: good3,
        points: 15,
        type: 'good',
        name: 'Jump Elixir',
        effect: 'Jump +15%',
        width: 38,
        height: 52
      },
      // Bad elixirs (penalties)
      {
        image: bad1,
        points: -5,
        type: 'bad',
        name: 'Slow Poison',
        effect: 'Speed -5%',
        width: 36,
        height: 45
      },
      {
        image: bad2,
        points: -10,
        type: 'bad',
        name: 'Weak Poison',
        effect: 'Score -10',
        width: 38,
        height: 47
      },
      {
        image: bad3,
        points: -15,
        type: 'bad',
        name: 'Heavy Poison',
        effect: 'Jump -15%',
        width: 40,
        height: 48
      }
    ];

    // Spawn an elixir at random position
    const spawnElixir = () => {
      if (gameOver || stageComplete || levelComplete) return;

      // Random elixir with weighted probability (more good elixirs in earlier stages)
      const goodProbability = 0.7 - (stage * 0.1); // Decreases with stage level
      const isGoodElixir = Math.random() < goodProbability;

      // Filter by type and select random elixir
      const availableElixirs = elixirTypes.filter(e => isGoodElixir ? e.type === 'good' : e.type === 'bad');
      const elixir = availableElixirs[Math.floor(Math.random() * availableElixirs.length)];

      // Calculate random Y position (higher positions are harder to reach)
      const minHeight = canvas.height - 140;
      const maxHeight = canvas.height - 300;
      const y = minHeight - Math.random() * (minHeight - maxHeight);

      elixirs.push({
        x: canvas.width + Math.random() * 500, // Spawn off-screen to the right
        y: y,
        width: elixir.width,
        height: elixir.height,
        image: elixir.image,
        points: elixir.points,
        name: elixir.name,
        effect: elixir.effect,
        type: elixir.type,
        rotation: 0, // For animation
        scale: 1, // For animation
        opacity: 1 // For animation
      });
    };

    // Spawn elixirs at different rates depending on stage
    const elixirInterval = setInterval(() => {
      // Higher stages have more frequent elixirs
      if (Math.random() < (0.3 + stage * 0.1)) {
        spawnElixir();
      }
    }, 1000 - (stage * 100)); // Faster spawning in higher stages

    const stageTimer = setInterval(() => {
      setTimeLeft((prev) => {
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

    skateboardSound.current.loop = true;
    skateboardSound.current.volume = 0.5;
    const playSkateboardSound = () => {
      if (!gameOver && !stageComplete && !levelComplete && (player.dx !== 0 || player.jumping)) {
        if (skateboardSound.current.paused) {
          skateboardSound.current.play().catch((e) => console.log('Sound play error:', e));
        }
      } else {
        skateboardSound.current.pause();
      }
    };

    const handleKeyDown = (e) => {
      if (gameOver || stageComplete || levelComplete) return;
      if (e.key === 'ArrowLeft') player.dx = -player.speed;
      if (e.key === 'ArrowRight') player.dx = player.speed;
      if (e.key === 'ArrowUp' && !player.jumping) {
        player.dy = -character.jumpPower;
        player.jumping = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let touchStartX = 0;
    const handleTouchStart = (e) => {
      if (gameOver || stageComplete || levelComplete) return;
      touchStartX = e.touches[0].clientX;
    };
    const handleTouchMove = (e) => {
      if (gameOver || stageComplete || levelComplete) return;
      const touchX = e.touches[0].clientX;
      player.dx = touchX > touchStartX ? player.speed : -player.speed;
    };
    const handleTouchEnd = () => {
      player.dx = 0;
    };
    const handleTouchJump = () => {
      if (gameOver || stageComplete || levelComplete || player.jumping) return;
      player.dy = -character.jumpPower;
      player.jumping = true;
    };

    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('click', handleTouchJump);

    // Create a DOM point popup with smooth animation
    const showPointPopup = (points, x, y) => {
      const popup = document.createElement('div');
      popup.style.position = 'absolute';
      popup.style.left = `${x}px`;
      popup.style.top = `${y}px`;
      popup.style.color = points > 0 ? '#4CC9F0' : '#FF006E';
      popup.style.fontSize = '1.4rem';
      popup.style.fontWeight = 'bold';
      popup.style.textShadow = '0 0 8px rgba(0, 0, 0, 0.8)';
      popup.style.padding = '5px 10px';
      popup.style.borderRadius = '5px';
      popup.style.minWidth = '60px';
      popup.style.textAlign = 'center';
      popup.style.fontFamily = 'Orbitron, sans-serif';
      popup.style.zIndex = '15';
      popup.style.pointerEvents = 'none';
      popup.style.opacity = '0';

      // Set background and border based on points
      popup.style.background = points > 0 ? 'rgba(76, 201, 240, 0.3)' : 'rgba(255, 0, 110, 0.3)';
      popup.style.border = `1px solid ${points > 0 ? '#4CC9F0' : '#FF006E'}`;

      // Show point value with sign
      popup.textContent = `${points > 0 ? '+' : ''}${points}`;

      document.body.appendChild(popup);

      // Smooth animation with GSAP
      gsap.to(popup, {
        opacity: 1,
        y: -30,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(popup, {
            opacity: 0,
            y: -50,
            duration: 0.5,
            delay: 0.3,
            ease: "power2.in",
            onComplete: () => {
              document.body.removeChild(popup);
            },
          });
        },
      });
    };

    const completeStage = () => {
      stageComplete = true;
      victorySound.current.play();
      setStageScores((prev) => [...prev, score]);
      gsap.to(stageCompleteRef.current, {
        opacity: 1,
        scale: 1.1,
        duration: 0.5,
        onStart: () => {
          gsap.to(canvasRef.current, {
            boxShadow: '0 0 40px rgba(76, 201, 240, 0.9)',
            duration: 0.3,
            repeat: 5,
            yoyo: true,
          });
          gsap.to(scoreRef.current, {
            scale: 1.5,
            duration: 0.5,
            repeat: 3,
            yoyo: true,
          });
        },
        onComplete: () => {
          setTimeout(() => {
            gsap.to(stageCompleteRef.current, { opacity: 0, scale: 1 });

            setStage((prev) => prev + 1);
            setTimeLeft(prev => prev === 60 ? 120 : 180);
            setScore(0);
            player.x = 100;
            player.y = canvas.height - 100;
            player.dx = 0;
            player.dy = 0;
            player.jumping = false;
            elixirs = [];
            baseTrackSpeed += 0.5;
            stageComplete = false;
          }, 2000);
        },
      });
    };

    const completeFinalLevel = () => {
      levelComplete = true;
      victorySound.current.play();

      // Calculate final score (sum of all stage scores + current score)
      const totalScore = stageScores.reduce((sum, s) => sum + s, 0) + score;
      setFinalScore(totalScore);

      // Create level complete message
      const levelCompleteElement = levelCompleteRef.current;
      if (levelCompleteElement) {
        levelCompleteElement.innerHTML = `
          <h2>🏆 Level 3 Complete!</h2>
          <p>You did it! Smooth moves, great skills.</p>
          <p><strong>Final Score: ${totalScore}</strong></p>
          <p>🚀 Keep pushing forward!</p>
          <div id="skateboard-image"></div>
        `;

        // Animate level complete message
        gsap.to(levelCompleteElement, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
          onStart: () => {
            // Create trophy particle effects
            createParticles();

            gsap.to(canvasRef.current, {
              boxShadow: '0 0 50px rgba(76, 201, 240, 0.9)',
              duration: 0.5,
              repeat: 3,
              yoyo: true,
            });
          }
        });
      }
    };

    // Create celebration particles
    const createParticles = () => {
      const particleCount = 50;
      const colors = ['#4CC9F0', '#F72585', '#7209B7', '#3A0CA3', '#4361EE'];

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.top = '50%';
        particle.style.left = '50%';
        particle.style.transform = 'translate(-50%, -50%)';
        particle.style.zIndex = '25';
        document.body.appendChild(particle);

        // Animate particle
        gsap.to(particle, {
          x: (Math.random() - 0.5) * window.innerWidth * 0.8,
          y: (Math.random() - 0.5) * window.innerHeight * 0.8,
          opacity: 0,
          duration: Math.random() * 2 + 1,
          ease: "power2.out",
          onComplete: () => {
            document.body.removeChild(particle);
          }
        });
      }
    };

    const triggerGameOver = () => {
      gameOver = true;
      skateboardSound.current.pause();
      defeatSound.current.play();
      gsap.to(gameOverRef.current, {
        opacity: 1,
        scale: 1.2,
        duration: 0.5,
        onComplete: () => {
          setTimeout(() => {
            gsap.to(gameOverRef.current, { opacity: 0, scale: 1 });
            setStage(1);
            setTimeLeft(60);
            setScore(0);
            setStageScores([]);
            baseTrackSpeed = 3;
            player.x = 100;
            player.y = canvas.height - 100;
            player.dx = 0;
            player.dy = 0;
            player.jumping = false;
            elixirs = [];
            gameOver = false;
            stageComplete = false;
          }, 2000);
        },
      });
    };

    const update = () => {
      if (gameOver || stageComplete || levelComplete) return requestAnimationFrame(update);

      // Clear canvas and draw background
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw floor
      ctx.fillStyle = '#333';
      ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

      // Update player position
      player.x += player.dx;
      player.y += player.dy;
      player.dy += 0.5; // Gravity

      // Floor collision
      if (player.y > canvas.height - 100 - player.height) {
        player.y = canvas.height - 100 - player.height;
        player.dy = 0;
        player.jumping = false;
      }

      // Screen boundaries
      if (player.x < 0) player.x = 0;
      if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

      playSkateboardSound();

      // Draw the player
      if (playerImageRef.current) {
        ctx.drawImage(playerImageRef.current, player.x, player.y, player.width, player.height);
      } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(player.x, player.y, player.width, player.height); // Fallback
      }

      // Draw and update elixirs
      elixirs.forEach((elixir, i) => {
        // Update elixir position
        elixir.x -= baseTrackSpeed;
        elixir.rotation += 0.02; // Rotate slowly for visual effect

        // Remove if off-screen
        if (elixir.x + elixir.width < 0) {
          elixirs.splice(i, 1);
          return;
        }

        // Save context for rotation/animation
        ctx.save();
        ctx.translate(elixir.x + elixir.width / 2, elixir.y + elixir.height / 2);
        ctx.rotate(elixir.rotation);
        ctx.globalAlpha = elixir.opacity;

        // Draw elixir using cached image
        if (elixirImageCache[elixir.image]) {
          ctx.drawImage(
            elixirImageCache[elixir.image],
            -elixir.width / 2,
            -elixir.height / 2,
            elixir.width * elixir.scale,
            elixir.height * elixir.scale
          );
        }

        ctx.restore();

        // Collision detection with player
        if (
          player.x < elixir.x + elixir.width &&
          player.x + player.width > elixir.x &&
          player.y < elixir.y + elixir.height &&
          player.y + player.height > elixir.y
        ) {
          // Collision effect
          elixir.opacity = 0;

          // Play appropriate sound
          if (elixir.type === 'good') {
            successSound.current.play();
          } else {
            errorSound.current.play();
          }

          // Remove elixir from array
          elixirs.splice(i, 1);

          // Update score with smooth animation
          setScore((prev) => {
            const newScore = Math.max(0, prev + elixir.points);
            // Show point popup with elixir name
            showPointPopup(elixir.points, player.x + player.width, player.y);

            // Check for stage completion
            if (newScore >= scoreThreshold && timeLeft > 0) {
              if (stage < 3) {
                completeStage();
              } else {
                completeFinalLevel();
              }
            }
            return newScore;
          });

          // Animate score display
          if (elixir.type === 'good') {
            gsap.to(scoreRef.current, {
              scale: 1.3,
              color: '#4CC9F0',
              duration: 0.2,
              yoyo: true,
              repeat: 1
            });
          } else {
            gsap.to(scoreRef.current, {
              scale: 0.9,
              color: '#FF006E',
              duration: 0.2,
              yoyo: true,
              repeat: 1
            });
          }

          // Screen effect based on elixir type
          if (elixir.type === 'bad') {
            // Subtle screen shake for bad elixirs
            gsap.to(canvasRef.current, {
              x: 3,
              duration: 0.1,
              yoyo: true,
              repeat: 2,
              ease: "power2.inOut"
            });
          } else {
            // Subtle glow for good elixirs
            gsap.to(canvasRef.current, {
              boxShadow: '0 0 15px rgba(76, 201, 240, 0.6)',
              duration: 0.2,
              yoyo: true,
              repeat: 1
            });
          }
        }
      });

      requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('click', handleTouchJump);
      clearInterval(stageTimer);
      clearInterval(elixirInterval);
      skateboardSound.current.pause();
    };
  }, [character, stage]);

  return (
    <GameContainer>
      <ScoreDisplay ref={scoreRef}>Score: {score}</ScoreDisplay>
      <StageDisplay ref={stageRef}>
        Stage {stage} - Time: {timeLeft}s
      </StageDisplay>
      <StageCompleteMessage ref={stageCompleteRef}>
        Awesome! Stage {stage} Crushed!<br />
        Score: {score}<br />
        Total: {stageScores.reduce((sum, s) => sum + s, 0) + score}
      </StageCompleteMessage>
      <GameOverMessage ref={gameOverRef}>Game Over!</GameOverMessage>
      <LevelCompleteMessage ref={levelCompleteRef}></LevelCompleteMessage>
      <Canvas ref={canvasRef} />
    </GameContainer>
  );
};

export default SkateNovaGame;