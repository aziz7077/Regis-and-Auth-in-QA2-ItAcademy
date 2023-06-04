import React, { useContext, useEffect, useState } from 'react';
import s from './Profile.module.scss'
import { LogoutOutlined } from '@ant-design/icons';
import { Button, Modal} from 'antd';
import './Profile.css'
import BasicInput from '../../components/UI/Input/Input';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { AddContext } from '../../Context';
import cr7 from '../../assets/cr7.jpg'


const Account = () => {
	const [modal, setModal] = useState(false);

	const {renderUser, setRenderUser} = useContext(AddContext)

	const [changeData, setChangeData] = useState({
		username: '',
		email: '',
		about: '',
		avatar: '',
	})


	let navigate = useNavigate();



	const handleLogout = () => {
		localStorage.removeItem('token');
		return navigate("/regis");
	};


	const getUser = async () => {
		try {
			let config = {
				headers: {
					'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("token"))
				}
			}
			await axios
				.get('http://localhost:8080/profile', config)
				.then((res) => setRenderUser(res.data.data))
				localStorage.setItem('getData' , renderUser)
		} catch (error) {
			console.log(error);
		}

	}

	console.log(localStorage.getItem('getData'));


	const changeInfo = async () => {
		try {
			let config = {
				headers: {
					'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
				}
			}
			const response = await axios.patch('http://localhost:8080/profile', { changeData  } , config);
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	}

	console.log(renderUser);

	useEffect(() => {
		getUser()
	}, [])

	return (
		<section className={s.container}>
			<div className={s.content}>
				<div className={s.about}>
					<img src={cr7} alt="profile_img" />
					<div className={s.about_up}>
						<p>{renderUser.username}</p>
						<p>{renderUser.email}</p>
						<button onClick={() => setModal(true)}>
							Редактировать</button>
					</div>
					<p>{renderUser.email}</p>
					<p>{renderUser.about}</p>
					<Button
						onClick={handleLogout}
						style={{ width: '130px', marginTop: '60px' }} icon={<LogoutOutlined />}>Выйти</Button>
				</div>
				<Modal
					title={false}
					closeIcon={false}
					width={'600px'}
					centered
					open={modal}
					footer={false}
					onOk={false}
					onCancel={false}
					content={false}
				>
					<div className={s.modalka}>
						<h3>Редактировать профиль</h3>
						<div className={s.modal_input}>
							<BasicInput value={changeData.username} onChange={(e) => (setChangeData({ ...changeData, username: e.target.value }))} title='Имя' style={{ height: '50px' }} />
							<BasicInput value={changeData.email} onChange={(e) => (setChangeData({ ...changeData, email: e.target.value }))} title='E-mail' style={{ height: '50px' }} />
							<BasicInput value={changeData.avatar} onChange={(e) => (setChangeData({ ...changeData, avatar: e.target.value }))} title='Url аватарки' style={{ height: '50px' }} />
							<BasicInput value={changeData.about} onChange={(e) => (setChangeData({ ...changeData, about: e.target.value }))} title='Описание' style={{ height: '150px', paddingBottom: '110px' }} />
						</div>
						<button onClick={() => setModal(false)}>Отмена</button>
						<button onClick={changeInfo}>Сохранить</button>
					</div>
				</Modal>
			</div>
		</section>
	);
};

export default Account;