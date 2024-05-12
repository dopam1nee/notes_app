const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = mongoose.Schema({
	// описание структуры данных
	email: {
		type: String, // тип данных - строка
		required: true, // обязательное поле
		unique: true, // уникальное поле
		validate: {
			validator: validator.isEmail, // проверяем, является ли электронной почтой
			message: 'Invalid email', // сообщение об ошибке
		}, // валидатор
	},
	password: {
		type: String, // тип данных - строка
		required: true, // обязательное поле
	},
})

const User = mongoose.model('User', UserSchema) // создание модели; модель позволяет работать с данными

module.exports = User
