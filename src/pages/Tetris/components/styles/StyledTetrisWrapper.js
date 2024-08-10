import styled from 'styled-components';
import bgimage from '../../img/bg.png'

export const StyledTetrisWrapper = styled.div`
    width : 100vw;
    height : 100vh;
    background : url(${bgimage}) #000;
    background-size : cover;
    overflow : hidden;
    z-index : 10;
`

export const StyledTetris = styled.div`
    display: flex;
    align-item: center;
    padding: 40px;
    margin : 0 auto;
    max-width: 900px;
`