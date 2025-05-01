import React from 'react';
import styled from 'styled-components';

const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #FF0066, #00DDEB);
  padding: 2rem;
  font-family: 'Montserrat', sans-serif;
`;

const Table = styled.table`
  width: 100%;
  max-width: 800px;
  border-collapse: collapse;
  background: #1A1A2E;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
`;

const TableHeader = styled.th`
  padding: 1rem;
  background: #FF0066;
  color: #E6E6FA;
  font-size: 1.2rem;
  text-transform: uppercase;
  text-align: left;
`;

const TableRow = styled.tr`
  transition: background 0.3s ease;

  &:nth-child(even) {
    background: #2A2A3E;
  }

  &:hover {
    background: #FFD70033;
    box-shadow: 0 0 10px #FFD700;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #E6E6FA;
  font-size: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  color: #E6E6FA;
  text-shadow: 0 0 10px #FFD700;
  margin-bottom: 2rem;
  text-transform: uppercase;
`;

const Record = () => {
  // Фейковый датасет
  const levels = ['Day City', 'Night Run', 'Rain Rush'];
  const characters = ['Blaze', 'Shadow', 'Nova'];

  const fakeData = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    level: levels[Math.floor(Math.random() * levels.length)],
    character: characters[Math.floor(Math.random() * characters.length)],
    score: Math.floor(Math.random() * (400 - 100 + 1)) + 100,
  }));

  return (
    <UserContainer>
      <Title>SkateNova Leaderboard</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Level</TableHeader>
            <TableHeader>Character</TableHeader>
            <TableHeader>Score</TableHeader>
          </tr>
        </thead>
        <tbody>
          {fakeData.map((data) => (
            <TableRow key={data.id}>
              <TableCell>{data.id34}</TableCell>
              <TableCell>{data.level}</TableCell>
              <TableCell>{data.character}</TableCell>
              <TableCell>{data.score}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </UserContainer>
  );
};

export default Record;