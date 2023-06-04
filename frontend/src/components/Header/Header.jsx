import React, { useContext } from "react";
import s from "./Header.module.scss";
import { Link, useLocation } from "react-router-dom";
import { AddContext } from "../../Context";
import cr7 from "../../assets/cr7.jpg";

const Header = () => {
  const { renderUser, setRenderUser } = useContext(AddContext);

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className={s.container}>
      <div className={s.content}>
        <div className={s.block}>
          <Link to='/regis'>
            <div className={s.logo}>Logo</div>
          </Link>

          <div className={s.title}>
            Разрабатываем и запускаем <br /> сложные веб проекты
          </div>
        </div>
        {isHomePage ? (
          <div className={s.up_profile}>
            <p>{renderUser.username}</p>
            <img src={cr7} alt="image" />
          </div>
        ) : (
          <div className={s.btn}>
            <Link to="/login">
              <button>Войти</button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
