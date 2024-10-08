import React, { useState, useEffect } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import { NavigateFunction, useNavigate } from "react-router-dom";
import type { LoginData, AuthUser } from "../types/types";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const {
    handleLogin,
    authUser,
  }: {
    handleLogin: (data: LoginData) => Promise<void>;
    authUser: AuthUser | null;
  } = useAuth();
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate("/dashboard");
    }
  }, [authUser]);

  const handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void = (e) => {
    e.preventDefault();
    handleLogin({ type: "password", email, password });
  };

  const handleGoogleLoginSuccess: (res: CredentialResponse) => void = async (
    res,
  ) => {
    handleLogin({ type: "google", credential: res?.credential });
  };

  return (
    !authUser && (
      <div className="flex h-dvh w-full items-center justify-center bg-zinc-200 dark:bg-zinc-900">
        <div className="mx-4 flex flex-col items-center justify-center gap-4 rounded-xl bg-white p-8 text-center shadow-2xl md:min-w-96 dark:bg-zinc-600">
          <h3>Sales App Admin</h3>

          <div className="my-2 h-0.5 w-full bg-zinc-400"></div>

          <h5>Prijavite se pomoću Google naloga</h5>
          <div className="flex w-full justify-center">
            <GoogleLogin
              onSuccess={(res: CredentialResponse) => {
                handleGoogleLoginSuccess(res);
              }}
              onError={() => {
                toast.warning(`Problem sa prijavom na Google nalog`, {
                  position: "top-center",
                });
              }}
              shape={"square"}
            />
          </div>
          <div className="my-2 h-0.5 w-full bg-zinc-400"></div>

          <h5>Ili se prijavite pomoću lozinke</h5>
          <form
            className="flex w-full flex-col gap-4"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
          >
            <input
              type="email"
              required
              className="w-full p-2"
              placeholder="Email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              value={email}
            />
            <input
              type="password"
              required
              className="w-full p-2"
              placeholder="Password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              value={password}
            />
            <button className="button button-sky dark:text-white">
              Prijavi se
            </button>
          </form>
          <a
            className="cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-400"
            onClick={() => console.log("Reset lozinke", email)}
          >
            <h6>Zaboravili ste lozinku?</h6>
          </a>
        </div>
      </div>
    )
  );
};

export default Login;
