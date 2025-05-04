import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import CryptoJS from "crypto-js";
import dynamic from "next/dynamic";

const EyeLottie = dynamic(() => import("@/components/EyeLottie"), { ssr: false });

export default function AuthPage() {
  const { user, login } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirm: false,
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    show: false,
  });

  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) router.push("/products");
  }, [user]);

  const handleRegister = () => {
    const { firstName, lastName, birthDate, email, password, confirmPassword } = formData;
    if (!firstName || !lastName || !birthDate || !email || !password || !confirmPassword) {
      return setError("Vyplňte všetky polia");
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return setError("Heslo musí obsahovať minimálne 8 znakov, 1 veľké písmeno, 1 číslo a 1 špeciálny znak.");
    }

    if (password !== confirmPassword) {
      return setError("Heslá sa nezhodujú");
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.email === email)) {
      return setError("Používateľ s touto e-mailovou adresou už existuje");
    }

    const hashedPassword = CryptoJS.SHA256(password).toString();
    const newUser = { firstName, lastName, birthDate, email, password: hashedPassword };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    login(firstName);
  };

  const handleLogin = () => {
    const { email, password } = loginData;
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const hashedPassword = CryptoJS.SHA256(password).toString();

    const found = users.find((u) => u.email === email && u.password === hashedPassword);
    if (!found) return setError("Neplatný e-mail alebo heslo");

    login(found.firstName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] font-montserrat px-4 py-8 overflow-auto">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          {isRegister ? "Registrácia" : "Vstup"}
        </h1>

        {isRegister ? (
          <>
            <input
              id="register-first-name"
              name="firstName"
              type="text"
              placeholder="Meno"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full mb-3 p-3 border border-[#CCCCCC] rounded focus:ring-2 focus:ring-[#F05A28] outline-none"
            />
            <input
              id="register-last-name"
              name="lastName"
              type="text"
              placeholder="Priezvisko"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full mb-3 p-3 border border-[#CCCCCC] rounded focus:ring-2 focus:ring-[#F05A28] outline-none"
            />
            <input
              id="register-birth-date"
              name="birthDate"
              type="date"
              placeholder="Dátum narodenia"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full mb-3 p-3 border border-[#CCCCCC] rounded focus:ring-2 focus:ring-[#F05A28] outline-none"
            />
            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full mb-3 p-3 border border-[#CCCCCC] rounded focus:ring-2 focus:ring-[#F05A28] outline-none"
            />

            <div className="relative mb-3">
              <input
                id="register-password"
                name="password"
                type={formData.showPassword ? "text" : "password"}
                placeholder="Heslo"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 border border-[#CCCCCC] rounded pr-10 focus:ring-2 focus:ring-[#F05A28] outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }))
                }
                className="absolute right-2 top-2 w-6 h-6"
              >
                <EyeLottie key="password-eye" playing={formData.showPassword} />
              </button>
            </div>

            <div className="relative mb-4">
              <input
                id="register-confirm-password"
                name="confirmPassword"
                type={formData.showConfirm ? "text" : "password"}
                placeholder="Potvrdenie hesla"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full p-3 border border-[#CCCCCC] rounded pr-10 focus:ring-2 focus:ring-[#F05A28] outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, showConfirm: !prev.showConfirm }))
                }
                className="absolute right-2 top-2 w-6 h-6"
              >
                <EyeLottie key="confirm-eye" playing={formData.showConfirm} />
              </button>
            </div>

            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            <button
              onClick={handleRegister}
              className="w-full bg-[#F05A28] text-white py-2 rounded font-semibold hover:bg-orange-600 transition-colors"
            >
              Zaregistrovať sa
            </button>
          </>
        ) : (
          <>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              className="w-full mb-4 p-3 border border-[#CCCCCC] rounded focus:ring-2 focus:ring-[#F05A28] outline-none"
            />
            <div className="relative mb-4">
              <input
                id="login-password"
                name="password"
                type={loginData.show ? "text" : "password"}
                placeholder="Heslo"
                autoComplete="current-password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full p-3 border border-[#CCCCCC] rounded pr-10 focus:ring-2 focus:ring-[#F05A28] outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setLoginData((prev) => ({ ...prev, show: !prev.show }))
                }
                className="absolute right-2 top-2 w-6 h-6"
              >
                <EyeLottie key="login-eye" playing={loginData.show} />
              </button>
            </div>
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            <button
              onClick={handleLogin}
              className="w-full bg-[#F05A28] text-white py-2 rounded font-semibold hover:bg-orange-600 transition-colors"
            >
              
                Prihlásiť sa
            </button>
          </>
        )}

        <p className="text-center text-sm mt-5 text-gray-600">
          {isRegister ? "Už máte účet?" : "Nemáte účet?"}{" "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-[#F05A28] hover:underline font-medium"
          >
            {isRegister ? "Prihlásiť sa" : "Zaregistrovať sa"}
          </button>
        </p>
      </div>
    </div>
  );
}
