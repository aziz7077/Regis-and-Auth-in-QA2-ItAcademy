const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const cors = require("cors");

const ACCESS_TOKEN_SECRET = 'topsecretkey'
const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// инициализация middleware
function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

const delayMiddleware = (req, res, next) => {
    setTimeout(() => {
        next();
    }, 1000);
};

// utils
function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// замоканная база данных
// !!! при кажом перезапуске api база массив users будет устанавливаться в это состояние!!
let users = [
    {
        id: 1,
        username: "test",
        email: "test@gmail.com",
        password: "123456",
        avatar: `https://picsum.photos/id/1/200/200`,
        about:
            "Я тестовый пользователь номер один. Я никогда не пропадаю между запусками api!"
    },
    {
        id: 2,
        username: "test2",
        email: "test2@gmail.com",
        avatar: `https://picsum.photos/id/2/200/200`,
        password: "1234567",
        about:
            "Я тестовый пользователь номер два. Я так же никогда не пропадаю между запусками api!"
    }
];

app.post("/login", delayMiddleware, (req, res) => {
    const {email, password} = req.body;

    const user = users.find(
        user => user.email === email && user.password === password
    );

    if (user) {
        // если пользователь найден в массиве users
        const token = jwt.sign(
            {id: user.id, username: user.username},
            "topsecretkey",
            {expiresIn: 129600}
        );

        res.json({
            error: null,
            token
        });
    } else {
        res.status(401).json({
            token: null,
            error: "Введите корректные логин и пароль."
        });
    }
});

app.get("/profile", authMiddleware, delayMiddleware, (req, res) => {
    const {id} = req.user;
    const user = users.find(user => user.id === id);
    if (user) {
        const {password, ...info} = user;
        res.json({
            data: info
        });
    } else {
        res.status(400).json({
            error: "Не удалось получить информацию о пользователе"
        });
    }
});

app.post("/register", delayMiddleware, (req, res) => {
    const {username, email, password} = req.body;

    // Валидация
    if (email && !validateEmail(email)) {
        return res.status(400).json({error: "Некорректный адрес электронной почты!"});
    }
    if (username.trim().length < 3) {
        return res.status(400).json({error: "Слишком короткое имя"});
    }
    if (password.trim().length < 4) {
        return res.status(400).json({error: "Слишком короткий пароль"});
    }

    // Проверяем, что такого пользователя еще нет в базе
    const isRegistered = users.some(user => user.email === email);
    if (isRegistered) {
        return res.status(400).json({error: "Пользователь с таким E-mail уже зарегистрирован"});
    }

    // Создаем нового пользователя
    const id = users.length + 1;
    const user = {
        id,
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        avatar: `https://picsum.photos/id/${id}/200/200`,
        about: null
    };
    users.push(user);

    // Генерируем JWT токен
    const token = jwt.sign({id: user.id, username: user.username}, ACCESS_TOKEN_SECRET, {
        expiresIn: "1d"
    });

    res.json({
        message: "Пользователь успешно зарегистрирован",
        token
    });
});

app.patch("/profile", authMiddleware, delayMiddleware, (req, res) => {
    const {username, email, password, about, avatar} = req.body;
    const {id} = req.user;

    // Проверка на пустые поля
    if (!username && !email && !password && !about && !avatar) {
        return res.status(400).json({error: "Нет данных для обновления"});
    }

    // Проверка валидности полей
    if (email && !validateEmail(email)) {
        return res.status(400).json({error: "Некорректный адрес электронной почты!"});
    }
    if (username && username.trim().length < 3) {
        return res.status(400).json({error: "Слишком короткое имя"});
    }
    if (password && password.trim().length < 4) {
        return res.status(400).json({error: "Слишком короткий пароль"});
    }

    if (about && about.trim().length < 3) {
        return res.status(400).json({error: "Слишком короткое описание"});
    }

    // Проверка уникальности email
    if (email) {
        const userWithEmail = users.find(user => user.email === email.trim());
        if (userWithEmail && userWithEmail.id !== id) {
            return res.status(400).json({error: "Пользователь с таким E-mail уже зарегистрирован"});
        }
    }

    // Обновляем данные пользователя в массиве users
    const user = users.find(user => user.id === id);
    if (user) {
        Object.assign(user, {
            username: username ? username.trim() : user.username,
            email: email ? email.trim() : user.email,
            password: password ? password.trim() : user.password,
            about: about ? about.trim() : user.about,
            avatar: avatar ? avatar.trim() : user.avatar
        });

        // Отправляем обновленные данные клиенту
        const {password, ...info} = user;
        res.json({
            message: "Данные успешно обновлены",
            data: info
        });
    } else {
        res.status(400).json({
            error: "Не удалось обновить информацию о пользователе"
        });
    }
});

// error handling
app.use((error, req, res, next) => {
    if (error.name === "UnauthorizedError") {
        // если пользователь не авторизован - отправляем ошибку о том что он не авторизован
        res.status(401).json({
            message: "Пользователь не авторизован"
        });
    } else {
        next(error);
    }
});

//дефолтный порт приложения
const PORT = 8080;
app.listen(PORT, () => {
    // eslint-disable-next-line
    console.log(`Сервер с API стартовал по адресу http://localhost:${PORT}`);
});
