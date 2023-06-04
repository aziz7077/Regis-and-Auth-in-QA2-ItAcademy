import React, { useState } from 'react';
import s from './Auth.module.scss'
import MyInput from '../../components/UI/MyInput/MyInput';
import MyButton from '../../components/UI/MyButton/MyButton';
import emailLogo from '../../assets/Email.png'
import passwordLogo from '../../assets/Password.png'
import Footer from '../../components/Footer/Footer';
import axios from 'axios'
import {useNavigate} from 'react-router-dom';
import Zagruzka from './../../components/Zagruzka/Zagruzka';


const Login = () => {
	const [userAuth, setUserAuth] = useState({
		email: '@gmail.com',
		password: ''
	})
	const [errorMessage, setErrorMessage] = useState('')
	const navigate = useNavigate();
	const [isLoading, setLoading] = useState('');

	
	

	const LOGIN_URL = 'http://localhost:8080/login'

	const Auth = async () => {
		if (userAuth.email.length > 1 || userAuth.password.length > 1) {
			try {
				setLoading(true)
				const { data } = await axios.post(LOGIN_URL, userAuth);
				console.log(data);
				localStorage.setItem('token', JSON.stringify(data.token));
				navigate('/');
			} catch (error) {
				setErrorMessage(error.response.data.error);
			}
			setLoading(false)
		}
	};
	return (
		<>
			<section className={s.container}>
				<div className={s.content}>
					{isLoading ? (
						<Zagruzka/>
					) : (
						<div>
						<h1>Вход</h1>
					<div className={s.inputs}>
						<MyInput value={userAuth.email} onChange={(e) => setUserAuth({ ...userAuth, email: e.target.value })}
							type={'email'} style={{ left: '22px', top: '17px' }} imageSrc={emailLogo} altText="Image description" placeholder="E-mail" />
						<MyInput value={userAuth.password} onChange={(e) => setUserAuth({ ...userAuth, password: e.target.value })}
							type={'password'} imageSrc={passwordLogo} altText="Image description" placeholder="Пароль" />
						{!!errorMessage.length && <span>{errorMessage}</span>}

					</div>
					<div className={s.btn}>
						<MyButton 
						disabled={!userAuth.email || !userAuth.password ? true : false} 
						onClick={Auth}>Войти</MyButton>
					</div>
					</div>
					)}
				</div>
			</section>
			<Footer title='Еще нет аккаунта?' titleLink='Зарегистрироваться' link='/regis' />
		</>

	);
};

export default Login;