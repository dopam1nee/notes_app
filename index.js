require('dotenv').config() // подключаем dotenv (файл с переменными окружения)

const express = require('express') // фреймворк для создания сервера http с использованием Node.js
const chalk = require('chalk') // библиотека для красивого вывода в консоль
const path = require('path') // библиотека для работы с путями
const mongoose = require('mongoose') // модуль для работы с MongoDB с использованием Node.js (соединение бэкенда с БД)
const cookieParser = require('cookie-parser') // библиотека для работы с куками
const { addNote, getNotes, removeNote, updateNote } = require('./notes.controller') // подключаем контроллер заметок
const { addUser, loginUser } = require('./users.controller') // подключаем контроллер пользователей
const auth = require('./middlewares/auth') // подключаем собственные middleware

const port = 3000 // порт
const app = express() // создаем экземпляр приложения express

app.set('view engine', 'ejs') // указываем, что используем EJS (это библиотека для работы с шаблонами view) в качестве движка представлений
app.set('views', 'pages') // указываем папку с шаблонами

app.use(express.static(path.resolve(__dirname, 'public'))) // подключаем статические файлы (статические файлы - это файлы, которые не изменяются при обновлении сайта или приложения)
app.use(express.json()) // подключаем парсер JSON; сервер автоматически парсит JSON-данные из тела запроса и добавляет их в req.body
app.use(cookieParser()) // подключаем парсер кук; сервер автоматически парсит куки из тела запроса и добавляет их в req.cookies; обрабатывает и содержит удобные для использования куки, позволяет отправлять методом эти куки
app.use(
	express.urlencoded({
		extended: true, // extended - это параметр, который включает расширенный парсер URL-encoded (анализ вложенных объектов)
	}),
) // подключаем парсер URL-encoded для обработки формы

app.get('/login', async (req, res) => {
	// обработчик GET-запроса на '/login'
	res.render('login', {
		// рендерим шаблон login.ejs
		title: 'Express App', // передаем переменные в шаблон
		error: undefined, // нет ошибок
	})
})

app.post('/login', async (req, res) => {
	try {
		const token = await loginUser(req.body.email, req.body.password) // вход в систему
		res.cookie('token', token, { httpOnly: true }) // добавляем куку)) с токеном в куки; httpOnly - это параметр, который указывает, что куки могут быть использованы только в HTTP-запросах (доступ есть только у сервера)
		res.redirect('/') // редиректим на главную страницу
	} catch (err) {
		res.render('login', {
			// рендерим шаблон login.ejs
			title: 'Express App', // передаем переменные в шаблон
			error: err.message, // есть ошибка
		})
	}
})

app.get('/register', async (req, res) => {
	// обработчик GET-запроса на '/register'
	res.render('register', {
		// рендерим шаблон register.ejs
		title: 'Express App', // передаем переменные в шаблон
		error: undefined, // нет ошибок
	})
})

app.post('/register', async (req, res) => {
	// обработчик GET-запроса на '/register'
	try {
		await addUser(req.body.email, req.body.password) // добавляем нового пользователя
		res.redirect('/login') // редиректим на страницу входа
	} catch (err) {
		if (err.code === 11000) {
			// если пользователь существует
			res.render('register', {
				// рендерим шаблон register.ejs
				title: 'Express App', // передаем переменные в шаблон
				error: 'Email is already registered', // есть ошибка
			})

			return // прекращаем выполнение функции
		}
		res.render('register', {
			// рендерим шаблон register.ejs
			title: 'Express App', // передаем переменные в шаблон
			error: err.message, // есть ошибка
		})
	}
})

app.get('/logout', (req, res) => {
	// обработчик GET-запроса на '/logout'
	res.cookie('token', '', { httpOnly: true }) // удаляем куки с токеном; httpOnly - это параметр, который указывает, что куки могут быть использованы только в HTTP-запросах (доступ есть только у сервера)
	res.redirect('/login') // редиректим на страницу входа
})

app.use(auth) // добавляем обработчик для проверки авторизации; регистрация и авторизация доступны всем пользователям, неавторизованному пользователю недоступна главная страница и все последующие

app.get('/', async (req, res) => {
	// обработчик GET-запроса на '/'
	res.render('index', {
		// рендерим шаблон index.ejs
		title: 'Express App', // передаем переменные в шаблон
		notes: await getNotes(), // получаем список заметок
		userEmail: req.user.email,
		created: false, // по умолчанию нет созданной заметки
		error: false, // по умолчанию нет ошибок
	})
})

app.post('/', async (req, res) => {
	// обработчик POST-запроса на '/'
	try {
		await addNote(req.body.title, req.user.email) // добавляем новую заметку
		res.render('index', {
			// рендерим шаблон index.ejs
			title: 'Express App', // передаем переменные в шаблон
			notes: await getNotes(), // получаем список заметок
			userEmail: req.user.email,
			created: true, // заметка создана
			error: false, // нет ошибок
		})
	} catch (err) {
		console.log('ERROR', err) // выводим в консоль ошибку
		res.render('index', {
			// рендерим шаблон index.ejs
			title: 'Express App', // передаем переменные в шаблон
			notes: await getNotes(), // получаем список заметок
			userEmail: req.user.email,
			created: false, // заметка не создана
			error: true, // есть ошибка
		})
	}
})

app.delete('/:id', async (req, res) => {
	// обработчик DELETE-запроса
	try {
		await removeNote(req.params.id, req.user.email) // удаляем заметку
		res.render('index', {
			// рендерим шаблон index.ejs
			title: 'Express App', // передаем переменные в шаблон
			notes: await getNotes(), // получаем список заметок
			userEmail: req.user.email,
			created: false, // нет созданной заметки
			error: false, // нет ошибок
		})
	} catch (err) {
		res.render('index', {
			// рендерим шаблон index.ejs
			title: 'Express App', // передаем переменные в шаблон
			notes: await getNotes(), // получаем список заметок
			userEmail: req.user.email,
			created: false, // нет созданной заметки
			error: err.message, // есть ошибка
		})
	}
})

app.put('/:id', async (req, res) => {
	// обработчик PUT-запроса
	try {
		await updateNote({ id: req.params.id, title: req.body.title }, req.user.email) // обновляем заметку
		res.render('index', {
			// рендерим шаблон index.ejs
			title: 'Express App', // передаем переменные в шаблон
			notes: await getNotes(), // получаем список заметок
			userEmail: req.user.email,
			created: false, // нет созданной заметки
			error: false, // нет ошибок
		})
	} catch (err) {
		res.render('index', {
			// рендерим шаблон index.ejs
			title: 'Express App', // передаем переменные в шаблон
			notes: await getNotes(), // получаем список заметок
			userEmail: req.user.email,
			created: false, // нет созданной заметки
			error: err.message, // есть ошибка
		})
	}
})

mongoose
	.connect(process.env.MONGODB_CONNECTION_STRING) // подключаемся к БД
	.then(() => {
		// если подключение удачное
		app.listen(port, () => {
			// запускаем сервер
			console.log(chalk.green(`Server has been started on port ${port}...`)) // выводим в консоль, что сервер запущен
		})
	})
