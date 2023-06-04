import React, { useEffect, useState } from 'react';
import s from './Register.module.scss'
import MyInput from '../../components/UI/MyInput/MyInput';
import profile from '../../assets/Avatar.png'
import emailLogo from '../../assets/Email.png'
import passwordLogo from '../../assets/Password.png'
import MyButton from '../../components/UI/MyButton/MyButton';
import Footer from '../../components/Footer/Footer';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Zagruzka from './../../components/Zagruzka/Zagruzka';

const Register = () => {
	const [error, setError] = useState('');
	const [Zagruzka, setZagruzka] = useState('');
	const [userData, setUserData] = useState({
		username: '',
		email: '@gmail.com',
		password: '',
	})

	const navigate = useNavigate();


	const BASE_URL = 'http://localhost:8080'

	const postDataUser = async () => {
		try {
			setZagruzka(true)
			await axios
				.post(BASE_URL + "/register", userData)
				.then((res) => localStorage.setItem('token', JSON.stringify(res.data.token)), console.log(localStorage))
			setUserData({ username: '', email: '', password: '' });
			window.location.reload();
		} catch (error) {
			setError(error.response.data.error)
		}
		setZagruzka(false);
	}


	return (
		<>
		<section className={s.container}>
			<div className={s.content}>
				{Zagruzka ? (
					<Zagruzka/>
				) : (

					<div>
						<h1>Регистрация</h1>
						<div className={s.inputs}>
							<MyInput value={userData.username} onChange={e => setUserData({ ...userData, username: e.target.value })}
								type={'text'} imageSrc={profile} altText="Image description" placeholder="Имя" />
							<MyInput
								value={userData.email} onChange={e => setUserData({ ...userData, email: e.target.value })}
								type={'email'} style={{ left: '22px', top: '17px' }} imageSrc={emailLogo} altText="Image description" placeholder="E-mail" />
							<MyInput
								value={userData.password} onChange={e => setUserData({ ...userData, password: e.target.value })}
								type={'password'} imageSrc={passwordLogo} altText="Image description" placeholder="Пароль" />

						</div>
						{!!error.length && <span>{error}</span>}
						<div className={s.btn}>
							<MyButton disabled={!userData.username || !userData.email || !userData.password ? true : false}
								onClick={postDataUser}>Создать аккаунт</MyButton>
						</div>
					</div>
				)}
			</div>
		</section>
		<Footer link={'/login'} title={'Уже есть аккаунт?'} titleLink={'Войти'} />
		
		</>
		

	);
};

export default Register;