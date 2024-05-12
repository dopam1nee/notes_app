const User = require('./models/User') // подключаем модель пользователей
const bcrypt = require('bcrypt') // подключаем библиотеку для хэширования паролей
const jwt = require('jsonwebtoken') // подключаем библиотеку для работы с JWT
const { JWT_SECRET } = require('./constants')

const addUser = async (email, password) => {
	// добавляем нового пользователя
	const passwordHash = await bcrypt.hash(password, 10) // хэшируем пароль (10 - кол-во хэш-функций)
	await User.create({ email, password: passwordHash }) // создаем нового пользователя
}

const loginUser = async (email, password) => {
	// вход в систему
	const user = await User.findOne({ email }) // получаем пользователя
	if (!user) {
		// если пользователь не найден
		throw new Error('User not found') // выбрасываем ошибку
	}
	const isPasswordCorrect = await bcrypt.compare(password, user.password) // сравниваем пароли (переданый пароль, хэшированный пароль); compare - функция для сравнения паролей
	if (!isPasswordCorrect) {
		// если пароли не совпадают
		throw new Error('Wrong password') // выбрасываем ошибку
	}

	return jwt.sign({ email }, JWT_SECRET, { expiresIn: '30d' }) // создаем токен; sign - функция для создания токена (что зашифровать, секретный ключ, опции: время жизни токена)
}

module.exports = { addUser, loginUser } // экспортируем функции
