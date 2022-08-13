import React from "react";
import { Container, Amount, Footer, Header, LastTransaction, Title, Icon } from "./styles";

export function HighlightCard(){
  return(
    <Container>
        <Header>
            <Title>Entrada</Title>
            <Icon name="arrow-up-circle"/>
        </Header>

        <Footer>
            <Amount>R$ 17.400,00</Amount>
            <LastTransaction>Última entrada dia 13 de abril</LastTransaction>
        </Footer>
    </Container>
  )
}