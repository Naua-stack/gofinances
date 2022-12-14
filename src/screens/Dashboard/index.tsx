import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";
import { useTheme } from "styled-components";
import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton,
  LoadContainer,
} from "./styles";
import { useAuth } from "../../hooks/auth";
import { LastTransaction } from "../../components/HighlightCard/styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighLightProps {
  amount: string;
  lastTransaction: string;
}

interface HighLightData {
  entries: HighLightProps;
  expensives: HighLightProps;
  total: HighLightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [hightLightData, setHighlightData] = useState<HighLightData>(
    {} as HighLightData
  );

  const theme = useTheme();
  const { signOut, user } = useAuth();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: "positive" | "negative"
  ) {
    const collectionFilttered = collection.filter(
      (transaction) => transaction.type === type
    );

    if (collectionFilttered.length === 0) {
      return 0;
    }

    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collectionFilttered.map((transaction) =>
          new Date(transaction.date).getTime()
        )
      )
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      "pt-BR",
      {
        month: "long",
      }
    )}`;
  }

  async function loadTransactions() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;

    const response = await AsyncStorage.getItem(dataKey);

    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        if (item.type === "positive") {
          entriesTotal = +Number(item.amount);
        } else {
          expensiveTotal = +Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const date = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
      }
    );

    setTransactions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(
      transactions,
      "positive"
    );

    const lastTransactionExpansives = getLastTransactionDate(
      transactions,
      "negative"
    );

    const totalInterval =
      lastTransactionExpansives === 0
        ? "Não há transações"
        : `01 a ${lastTransactionExpansives}`;

    const total = entriesTotal - expensiveTotal;

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction:
          lastTransactionEntries === 0
            ? "Não há transações"
            : `Última entrada dia ${lastTransactionEntries}`,
      },
      expensives: {
        amount: expensiveTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction:
          lastTransactionExpansives === 0
            ? "Não há transações"
            : `Última saída dia ${lastTransactionExpansives}`,
      },
      total: {
        amount: total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: totalInterval,
      },
    });

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: user.photo,
                  }}
                />

                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              type="up"
              title="Entradas"
              amount={hightLightData.entries.amount}
              lastTransaction={hightLightData.entries.lastTransaction}
            />
            <HighlightCard
              type="down"
              title="Saídas"
              amount={hightLightData.expensives.amount}
              lastTransaction={hightLightData.expensives.lastTransaction}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={hightLightData.total.amount}
              lastTransaction={hightLightData.total.lastTransaction}
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionsList
              keyExtractor={(item) => item.id.toString()}
              data={transactions}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
