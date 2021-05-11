import React from "react";
import styled from "styled-components";

const PoweredByContainer = styled.div`
  width: 100%;
  text-align: center;
  position: fixed;
  bottom: 1rem;
  margin: 0 auto;
  color: ${(p) => p.theme.colors.primary};
  cursor: pointer;
`;

const PoweredBy = () => {
  return (
    <PoweredByContainer
      onClick={() => window.open("https://www.coingecko.com/en")}
    >
      <b>Powered By CoinGecko</b>
    </PoweredByContainer>
  );
};

export default PoweredBy;
