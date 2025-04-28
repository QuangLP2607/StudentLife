import styles from "./GlobalStyles.module.scss";

function GlobalStyles({ children }) {
  return <div className={styles.global}>{children}</div>;
}

export default GlobalStyles;
