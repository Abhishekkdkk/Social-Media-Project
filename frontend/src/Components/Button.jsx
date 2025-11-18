import React from 'react'
import styled from 'styled-components'

function Button({text}) {
  return (
    <Buton text={text}>
        {text}
    </Buton>
  )
}

export default Button


const Buton = styled.button`
    width: 90px ;
    color: white;
    background-color: #0575E6;
    outline: none;
    border: none;
    border-radius: 25px;
    padding: 8px 12px;
    font-size: 11px;
    
`
