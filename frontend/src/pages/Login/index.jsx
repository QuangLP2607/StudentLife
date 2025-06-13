import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import logo from "@/assets/logo1.png";
import authService from "../../services/authService";
import Alert from "@components/Arlert";
import { useAlert } from "../../hooks/useAlert";
import { UserContext } from "../../contexts/UserContext";

const cx = classNames.bind(styles);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { alert, showAlert, clearAlert } = useAlert();

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogin = async () => {
    if (!isValidEmail(email)) return showAlert("Email không hợp lệ!", "error");

    try {
      const response = await authService.login(email, password);
      const { accessToken, user } = response.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      showAlert("Đăng nhập thành công!", "success");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      showAlert(error.response?.data?.message || "Có lỗi xảy ra!", "error");
    }
  };

  const handleSignup = async () => {
    if (!isValidEmail(email)) return showAlert("Email không hợp lệ!", "error");

    if (password !== confirmPassword)
      return showAlert("Mật khẩu xác nhận không khớp!", "error");

    try {
      await authService.signup(username, email, password);
      showAlert("Đăng ký thành công!", "success");
      setIsLogin(true);
    } catch (error) {
      showAlert(error.response?.data?.message || "Có lỗi xảy ra!", "error");
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isLogin ? handleLogin() : handleSignup();
  };

  return (
    <div className={cx("login")}>
      <Alert alert={alert} clearAlert={clearAlert} />

      <div className={cx("login__form")}>
        <form
          className={cx("login__form-content", {
            "login__form-content--signup": !isLogin,
          })}
          onSubmit={handleSubmit}
        >
          <div className={cx("login__title")}>
            {isLogin ? "Đăng nhập tài khoản" : "Đăng ký tài khoản"}
          </div>

          <input
            className={cx("login__input")}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          {!isLogin && (
            <input
              className={cx("login__input")}
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          )}
          <input
            className={cx("login__input")}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {!isLogin && (
            <input
              className={cx("login__input")}
              placeholder="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          )}

          <button className={cx("login__button")} type="submit">
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        <div className={cx("login__form-side")}>
          <img className={cx("login__logo")} src={logo} alt="Logo" />
          <button
            className={cx("login__button")}
            type="button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </button>
        </div>
      </div>
    </div>
  );
}
