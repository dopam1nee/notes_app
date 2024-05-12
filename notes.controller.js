const chalk = require('chalk') // подключаем библиотеку для красивого вывода в консоль
const Note = require('./models/Note') // подключаем модель заметок

const getNotes = async () => {
	// функция для получения списка заметок
	const notes = await Note.find() // получаем данные; find - возвращает JSON массив (не строку, которую нужно парсить в JSON)
	return notes // возвращаем список заметок
}

const addNote = async (title, owner) => {
	// функция для добавления новой заметки
	await Note.create({ title, owner }) // создаём новую заметку, сохраняя её в БД
	console.log(chalk.bgGreen('Note was added!')) // выводим в консоль, что заметка добавлена
}

const removeNote = async (id, owner) => {
	// функция для удаления заметки
	const result = await Note.deleteOne({ _id: id, owner }) // удаляем заметку
	if (!result.deletedCount) throw new Error('No note to delete') // если не удалили заметку (ничего не нашли), выбрасываем ошибку
	console.log(chalk.red(`Note with id="${id}" has been removed.`)) // выводим в консоль, что заметка удалена
}

const updateNote = async (noteData, owner) => {
	// функция для обновления заметки
	const result = await Note.updateOne(
		{ _id: noteData.id, owner },
		{ title: noteData.title },
	) // обновляем заметку (обновляем title (новые данные) по id (фильтр - критерий для поиска данных, которые нужно обновить))
	if (!result.matchedCount) throw new Error('No note to edit') // если не обновили заметку (ничего не нашли), выбрасываем ошибку
	console.log(chalk.bgGreen(`Note with id="${noteData.id}" has been updated!`)) // выводим в консоль, что заметка обновлена
}

module.exports = {
	// экспортируем функции
	addNote,
	getNotes,
	removeNote,
	updateNote,
}
