const fs = require('fs/promises') // подключаем библиотеку для работы с файлами
const path = require('path') // подключаем библиотеку для работы с путями
const chalk = require('chalk') // подключаем библиотеку для красивого вывода в консоль

const notesPath = path.join(__dirname, 'db.json') // путь к файлу db.json

const getNotes = async () => {
	// функция для получения списка заметок
	const notes = await fs.readFile(notesPath, { encoding: 'utf-8' }) // читаем содержимое файла db.json
	return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [] // возвращаем список заметок или пустой список
}

const saveNotes = async notes => {
	// функция для сохранения списка заметок
	await fs.writeFile(notesPath, JSON.stringify(notes)) // записываем список заметок в файл db.json
}

const addNote = async title => {
	// функция для добавления новой заметки
	const notes = await getNotes() // получаем список заметок
	const note = {
		// создаём новую заметку
		title,
		id: Date.now().toString(),
	}

	notes.push(note) // добавляем новую заметку в список

	await saveNotes(notes) // сохраняем список заметок
	console.log(chalk.bgGreen('Note was added!')) // выводим в консоль, что заметка добавлена
}

const printNotes = async () => {
	// функция для вывода списка заметок в консоль
	const notes = await getNotes() // получаем список заметок

	console.log(chalk.bgBlue('Here is the list of notes:')) // выводим в консоль, что список заметок получен
	notes.forEach(note => {
		// выводим список заметок в консоль поочередно
		console.log(chalk.bgWhite(note.id), chalk.blue(note.title))
	})
}

const removeNote = async id => {
	// функция для удаления заметки
	const notes = await getNotes() // получаем список заметок

	const filtered = notes.filter(note => note.id !== id) // фильтруем список заметок

	await saveNotes(filtered) // сохраняем список заметок
	console.log(chalk.red(`Note with id="${id}" has been removed.`)) // выводим в консоль, что заметка удалена
}

const updateNote = async noteData => {
	// функция для обновления заметки
	const notes = await getNotes() // получаем список заметок
	const index = notes.findIndex(note => note.id === noteData.id) // получаем индекс заметки
	if (index >= 0) {
		// если заметка существует
		notes[index] = { ...notes[index], ...noteData } // обновляем заметку
		await saveNotes(notes) // сохраняем список заметок
		console.log(chalk.bgGreen(`Note with id="${noteData.id}" has been updated!`)) // выводим в консоль, что заметка обновлена
	}
}

module.exports = {
	// экспортируем функции
	addNote,
	getNotes,
	removeNote,
	updateNote,
}
