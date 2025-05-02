import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #FF0066, #00DDEB);
  padding: 2rem;
  font-family: 'JetBrains Mono', monospace;
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
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
  font-size: 1rem;
  text-transform: uppercase;
  text-align: left;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.5rem;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #E6E6FA;
  font-size: 1rem;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  color: #E6E6FA;
  text-shadow: 0 0 10px #FFD700;
  margin-bottom: 1.5rem;
  text-transform: uppercase;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 15px;
  left: 15px;
  background: transparent;
  border: none;
  cursor: pointer;

  @media (max-width: 480px) {
    top: 10px;
    left: 10px;
  }
`;

const Record = () => {
  const navigate = useNavigate();

  const fakeData = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    level: ['Day City', 'Night Run', 'Rain Rush'][index % 3],
    character: ['Blaze', 'Shadow', 'Nova'][index % 3],
    score: Math.floor(Math.random() * 300) + 100,
  }));

  return (
    <UserContainer>
      <BackButton onClick={() => navigate(-1)}>
        <ChevronLeftIcon
          sx={{
            color: 'white',
            fontSize: 45,
            cursor: "pointer",
            "&:hover": { color: "beige" }
          }}
        />
      </BackButton>
      <Title>SkateNova Leaderboard</Title>
      <TableWrapper>
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
              <tr key={data.id}>
                <TableCell>{data.id}</TableCell>
                <TableCell>{data.level}</TableCell>
                <TableCell>{data.character}</TableCell>
                <TableCell>{data.score}</TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </UserContainer>
  );
};

export default Record;
