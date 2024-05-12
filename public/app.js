const update = async newNote => {
	// функция для обновления заметки
	await fetch(`/${newNote.id}`, {
		// обновляем заметку
		method: 'PUT', // метод обновления
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}, // заголовки
		body: JSON.stringify(newNote), // передаём новую заметку
	})
}

const remove = async id => {
	// функция для удаления заметки
	await fetch(`/${id}`, { method: 'DELETE' }) // удаляем заметку
}

document.addEventListener('click', event => {
	// обработчик событий по клику
	if (event.target.dataset.type === 'remove') {
		// если нажали на кнопку удаления
		const id = event.target.dataset.id // получаем id - notes[i].id

		remove(id).then(() => {
			// удаляем заметку
			event.target.closest('li').remove() // удаляем li
		})
	}

	if (event.target.dataset.type === 'edit') {
		// если нажали на кнопку редактирования
		const $task = event.target.closest('li') // получаем li
		const id = event.target.dataset.id // получаем id - notes[i].id
		const title = event.target.dataset.title // получаем заметку - notes[i].title (<span><%= notes[i].title %></span>)
		const initialHtml = $task.innerHTML // сохраняем начальную вёрстку заметки (li)

		$task.innerHTML = `
      <input type="text" value="${title}">
      <div>
        <button class="btn btn-success" data-type="save">Save</button>
        <button class="btn btn-danger" data-type="cancel">Cancel</button>
      </div>
    ` // редактируем заметку в li

		const taskListener = ({ target }) => {
			// объявляем обработчик кнопки редактирования
			if (target.dataset.type === 'cancel') {
				// если нажали на кнопку отмены
				$task.innerHTML = initialHtml // возвращаем в li начальную вёрстку
				$task.removeEventListener('click', taskListener) // удаляем обработчик
			}
			if (target.dataset.type === 'save') {
				// если нажали на кнопку сохранения
				const title = $task.querySelector('input').value // получаем новую заметку
				update({ title, id }).then(() => {
					// обновляем заметку
					$task.innerHTML = initialHtml // возвращаем в li начальную вёрстку
					$task.querySelector('span').innerText = title // обновляем span
					$task.querySelector('[data-type=edit]').dataset.title = title // обновляем data-title
					$task.removeEventListener('click', taskListener) // удаляем обработчик
				})
			}
		}

		$task.addEventListener('click', taskListener) // добавляем обработчик
	}
})
