const mongoose = require('mongoose')

const NoteSchema = mongoose.Schema({
	// описание структуры данных
	title: {
		// заметка
		type: String, // тип данных - строка
		required: true, // обязательное поле
	},
	owner: {
		type: String, // тип данных - строка
		required: true, // обязательное поле
	},
})

const Note = mongoose.model('Note', NoteSchema) // создание модели; модель позволяет работать с данными

module.exports = Note
