import styles from "../styles/Home.module.css";

export const Card = ({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children;
}) => {
  return (
    <a href={href} className={styles.card}>
      <h3>{title}</h3>
      {children}
    </a>
  );
};
