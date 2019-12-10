'use strict'

const Task = use('App/Models/Task')
const { validateAll } = use('Validator')

class TaskController {
    async index({ view }) {
       const tasks = await Task.all()

        return view.render('tasks', {
            title: 'Latest tasks!!!',
            tasks: tasks.toJSON()
        })
    }

    async store({ request, response, session }) {

        const message = {
            'title.required': 'Required',
            'title.min': 'min 3',
        }

        const validation = await validateAll(request.all(), {
            title: 'required|min:3|max:140',
            body: 'required|min:3'
        }, message)

        if(validation.fails()) {
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back')
        }

        const task = new Task() // criando um objeto

        task.title = request.input('title') // pegando informações
        task.body = request.input('body')  // pegando informações

        await task.save()  // salvando informações

        session.flash({ notification: 'Task added!' })  // enviando notificação sucesso

        return response.redirect('/tasks') //redirecionando para pagina de listagem
    }

    async detail({ params, view }) {
        const task = await Task.find(params.id) // buscando registro do banco de dados
        
        return view.render('detail', {
            task: task
        })
    }

    async remove({ params, response, session}) {
        const task = await Task.find(params.id)
        await task.delete()
        session.flash({ notification:' Task removed!' })

        return response.redirect('/tasks')
    }
}

module.exports = TaskController
