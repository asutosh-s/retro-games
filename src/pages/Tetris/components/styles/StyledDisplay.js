import styled from 'styled-components';

export const StyledDisplay = styled.div`
  box-sizing: border-box;
  display: flex;               /* Use flexbox */
  justify-content: center;    /* Center horizontally */
  align-items: center;        /* Center vertically */
  align-content: center;      /* Center content if multiple lines */
  margin: 10px 20px;
  padding: 10px;
  border: 4px solid #333;
  height: 30px;
  height: 30px;
  width: 8vw; /* Width as a percentage of the viewport width */
  border-radius: 20px;
  color: ${props => (props.gameover ? 'red' : '#999')};
  background: #000;
  font-family: Pixel, Arial;
  font-size: 0.6rem;

  

  @media (max-width: 768px) {
    width: 25vw;
    height: 20px;
    padding: 10px;
    font-size: 0.5rem;
    margin: 5px;
    align-content: center; /* Center content */
  }
`;
