import {
  Container,
  Fields,
  Form,
  Header,
  Title,
  TransactionsTypes,
} from "./styles";

import { Input } from "../../components/Form/Input";
import { Button } from "../../components/Form/Button";
import { TransactionTypeButton } from "../../components/TransactionTypeButton";
import { useState } from "react";
import { CategorySelect } from "../../components/Form/CategorySelect";

export function Register() {
  const [transactionType, setTransactionType] = useState("");

  function handleTransactionsTypeSelect(type: "up" | "down") {
    setTransactionType(type);
  }

  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <Input placeholder="Nome" />
          <Input placeholder="Preço" />

          <TransactionsTypes>
            <TransactionTypeButton
              type="up"
              title="Income"
              onPress={() => handleTransactionsTypeSelect("up")}
              isActive={transactionType === "up"}
            />

            <TransactionTypeButton
              type="down"
              title="Outcome"
              onPress={() => handleTransactionsTypeSelect("down")}
              isActive={transactionType === "down"}
            />
          </TransactionsTypes>

          <CategorySelect title="Categoria" />
        </Fields>

        <Button title="Enviar" />
      </Form>
    </Container>
  );
}