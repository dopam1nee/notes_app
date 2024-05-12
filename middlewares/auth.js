const jwt = require('jsonwebtoken') // подключаем библиотеку для работы с JWT
const { JWT_SECRET } = require('../constants')

const auth = (req, res, next) => {
	// обработчик для проверки авторизации
	const token = req.cookies.token // получаем токен из кук

	try {
		const verifyResult = jwt.verify(token, JWT_SECRET) // проверяем токен (токен, секретный ключ)
		req.user = {
			email: verifyResult.email,
		}
		next() // если токен верный, то выполняем следующий обработчик
	} catch (err) {
		// если токен неверный
		res.redirect('/login') // редиректим на страницу входа
	}
}

module.exports = auth
