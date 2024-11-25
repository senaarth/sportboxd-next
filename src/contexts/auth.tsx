"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { SignUpModal } from "@/components/signup-modal";
import { LoginModal } from "@/components/login-modal";
import { useToast } from "@/hooks/use-toast";
import { LoadingScreen } from "@/components/loading-screen";
import { ConfirmationModal } from "@/components/confirmation-modal";

type AuthContextType = {
  isAuthenticated: boolean;
  handleLoginWithEmail: (email: string, password: string) => void;
  user: User | null;
  openLoginModal: () => void;
  openSignUpModal: () => void;
  openConfirmationModal: (message: string) => void;
  handleLogout: () => Promise<void>;
  handleLoginWithGoogle: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const googleProvider = new GoogleAuthProvider();
  const { toast } = useToast();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [isSignUpOpen, setSignUpOpen] = useState<boolean>(false);
  const [isLoginOpen, setLoginOpen] = useState<boolean>(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );

  async function handleLoginWithEmail(username: string, password: string) {
    try {
      const res = await signInWithEmailAndPassword(auth, username, password);

      setUser(res.user);

      setLoginOpen(false);

      toast({ title: "Login realizado com sucesso!" });
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error(error.message);
      }
      toast({ title: "Erro no login." });
    }
  }

  async function handleSignupWithEmail(
    username: string,
    email: string,
    password: string
  ) {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(res.user, { displayName: username });
      await sendConfirmationEmail(res.user);

      setUser(res.user);
      setSignUpOpen(false);

      toast({
        title: "Conta criada com sucesso!",
        description:
          "Em instantes, você deve receber um e-mail de confirmação.",
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error(error.message);
      }
      toast({ title: "Erro na criação da conta." });
    }
  }

  async function handleLoginWithGoogle() {
    try {
      const res = await signInWithPopup(auth, googleProvider);

      setUser(res.user);
      setLoginOpen(false);
      setSignUpOpen(false);

      toast({
        title: "Login realizado com sucesso!",
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error(error.message);
      }
      toast({ title: "Erro na autenticação" });
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error(error.message);
      }
    }
  }

  async function sendConfirmationEmail(userToVerify: User | null) {
    if (!userToVerify) {
      handleLogout();
      return;
    }

    try {
      await sendEmailVerification(userToVerify);
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(error.message);
      }
      throw new Error("Erro no envio do e-mail de confirmação");
    }
  }

  async function initializeUser(userToInitialize: User | null) {
    if (userToInitialize) setUser({ ...userToInitialize });
    else setUser(null);
    setLoading(false);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        handleLoginWithEmail,
        openLoginModal: () => setLoginOpen(true),
        openSignUpModal: () => setSignUpOpen(true),
        openConfirmationModal: (message: string) =>
          setConfirmationMessage(message),
        handleLogout,
        handleLoginWithGoogle,
      }}
    >
      {isLoading ? <LoadingScreen /> : children}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setSignUpOpen(false)}
        openLoginModal={() => setLoginOpen(true)}
        onSubmit={handleSignupWithEmail}
        onSubmitWithGoogle={handleLoginWithGoogle}
      />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        openSignUpModal={() => setSignUpOpen(true)}
        onSubmit={handleLoginWithEmail}
        onSubmitWithGoogle={handleLoginWithGoogle}
      />
      {confirmationMessage ? (
        <ConfirmationModal
          confirmationMessage={confirmationMessage}
          onClose={() => setConfirmationMessage(null)}
          onSubmit={async () => {
            try {
              await sendConfirmationEmail(user);
              setConfirmationMessage(null);
              toast({
                title: "E-mail enviado!",
                description:
                  "Em instantes, você deve receber um e-mail de confirmação.",
              });
            } catch {
              toast({
                title: "Erro no envio do e-mail",
                description: "Tente novamente mais tarde.",
              });
              handleLogout();
            }
          }}
        />
      ) : null}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
