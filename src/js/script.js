class CommentList {
	// основной класс, в котором хранятся комментарии

	constructor() {
		this.list = [];
		this._getComments()
	}

	_getComments() {
		// получение комментариев с сервера
		$.ajax({
		    url: 'db/init.php',
		    method: 'get',
		    dataType: 'json',
		    success: response => {
		    	this.list = response;
		        this._render();
		    },
		    error: response => {
		        console.error(response)
		    },
		});	
	}

	_render() {
		// вывод блока с комментариями
		const block = document.querySelector('#comments');
		this.list.forEach(item => {
			let comment = new Comment(item.name, item.mail, item.msg);
			block.insertAdjacentHTML('beforeend', comment.render());
		})
	}

	add() {

	}
}

class Comment {
	// класс отдельного комментария
	constructor(name, mail, msg) {
		this.name = name;
		this.mail = mail;
		this.msg = msg
	}

	render() {
		// вывод комментария
		return `<div class="col-12 col-md-6 col-xl-4 post-wrapper">
					<div class="card">
						<div class="card__title">${this.name}</div>
						<div class="card__caption">
							<span>${this.mail}</span>
							${this.msg}
						</div>						
					</div>
				</div>`;
	}

	add(target = "#comments") {
		// добавление отдельного коммента в указанном блоке
		const block = document.querySelector(target);
		block.insertAdjacentHTML('beforeend', this.render());
	}
}

class JSMailer {
	// класс для работы с формой
	constructor(formName = '.comment-form') {

		this.form = document.querySelector(formName);
		this.formData = {};
		this.validator = new Map ([
			['name', /^[a-zA-Zа-яА-ЯёЁ]+/],
			['email', /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/],
			['comment', /[^\s]+/]
		]);
		this._init()
	}

	_init() {
		this.form.addEventListener('submit', e => {
			e.preventDefault();
			this.formData = new FormData(this.form);
			if (this._validate()) {
				this._sending()
			}
		})
	}

	_sending() {
		// отправка данных на сервер
		fetch('db/mailer.php', {
				method: 'post',
				body: this.formData
			}).then(response => {
				return response.text()
			}).then(data => {
				// отправлено успешно - добавляем новый коммент
				console.log(data);
				if (data === 'success') {
					const comment = new Comment(
						this.formData.get('name'),
						this.formData.get('email'),
						this.formData.get('comment'))
					comment.add();
					this._clearInputs()					
				}
			}).catch(error => {
				// ошибка отправления
				console.error(error)
			});
	}

	_validate() {
		// валидация полей
		let valid = true;
		this.validator.forEach((reg, field) => {
			const blockHelp = document.querySelector(`#${field}Help`);
			if (reg.test(this.formData.get(field))) {
				// проверка поля пройдена
				blockHelp.classList.add('hidden');
			} else {
				// проверка не пройдена
				valid = false;
				blockHelp.classList.remove('hidden');
			}
		})
		return valid
	}

	_clearInputs() {
		// очистка полей после удечной отправки формы
		let inputs = this.form.querySelectorAll('input');
		inputs.forEach(el => {
			el.value = '';
		});
		let textareas = this.form.querySelectorAll('textarea');
		textareas.forEach(el => {
			el.value = '';
		});				
	}
}

$(document).ready(() => {
	const commentList = new CommentList();
	const isMailer = new JSMailer();
})

