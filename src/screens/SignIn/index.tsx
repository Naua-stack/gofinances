import React, { useState } from "react";
import { Alert, ActivityIndicator, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import AppleSvg from "../../assets/apple.svg";
import GoogleSvg from "../../assets/google.svg";
import LogoSvg from "../../assets/logo.svg";
import { SignInSocialButton } from "../../components/SignInSocialButton";
import { useAuth } from "../../hooks/auth";
import {
  Container,
  Header,
  Title,
  TitleWrapper,
  SignInTitle,
  Footer,
  FooterWrapper,
} from "./styles";

export function SignIn() {
  const { signInWithGoogle, signInWithApple } = useAuth();
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSignInWithGoogle() {
    setIsLoading(true);

    try {
      return await signInWithGoogle();
    } catch (error) {
      Alert.alert("Não foi possível conectar a conta google");

      setIsLoading(false);
    }
  }

  async function handleSignInWithApple() {
    setIsLoading(true);

    try {
      return await signInWithApple();
    } catch (error) {
      Alert.alert("Não foi possível conectar a conta apple");

      setIsLoading(false);
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />

          <Title>
            Controle suas{"\n"}
            finanças de forma{"\n"}
            muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com {"\n"}
          uma das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          {Platform.OS === "ios" && (
            <SignInSocialButton
              title="Entrar com Apple"
              svg={AppleSvg}
              onPress={handleSignInWithApple}
            />
          )}
        </FooterWrapper>

        {isLoading && (
          <ActivityIndicator
            color={theme.colors.shape}
            style={{ marginTop: 18 }}
          />
        )}
      </Footer>
    </Container>
  );
}
