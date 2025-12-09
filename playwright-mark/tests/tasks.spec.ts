import { expect, test } from '@playwright/test';
import { TaskModel } from './fixtures/task.model';
import { deleteTaskByHelper, postTask } from './support/helpers';
import { TasksPage } from './support/pages/tasks/index';
import data from './fixtures/tasks.json';


test.describe('Cadastro de tarefas', () => {

    test('deve poder cadastraruma nova tarefa', async ({ page, request }) => {

        const task = data.sucess as TaskModel;

        await deleteTaskByHelper(request, task.name);

        const tasksPage: TasksPage = new TasksPage(page);
        //const taskPage: TasksPage -> Declara uma nova variável chamada taskPage do tipo TasksPage
        // Isso garante que a variável taskPage só pode armazenar objetos que são instâncias da classe TasksPage
        // new TasksPage(page) -> Chama o método constructor da classe TasksPage para inicializar esse novo objeto.
        // page aqui já está na pág de teste. Será esse contexto que será passado para a classe TasksPage
        // para que saiba exatamente o contexto em que precisa manipular o navegador.

        await tasksPage.go();
        await tasksPage.created(task);
        await tasksPage.shouldHaveText(task.name);


    });

    test('não deve permiti tarefa duplicada', async ({ page, request }) => {

        const task = data.duplicate as TaskModel;

        await deleteTaskByHelper(request, task.name);

        await postTask(request, task);

        const tasksPage: TasksPage = new TasksPage(page);

        await tasksPage.go();
        await tasksPage.created(task);
        await tasksPage.alertHaveText('Task already exists!');

    })

    test('campo obrigatório', async ({ page }) => {

        const task = data.required as TaskModel;

        const tasksPage: TasksPage = new TasksPage(page);

        await tasksPage.go();
        await tasksPage.created(task);

        //Não é possível pegar a msg de erro porque ela não é um HTML. Ela é gerada no 
        //próprio navegador pelo atributo required do input

        const validationMessage = await tasksPage.inputTaskName.evaluate(element => (element as HTMLInputElement).validationMessage);
        //O método evaluate() do Playwright permite executar código JavaScript dentro do contexto do navegador
        // (element => (element as HTMLInputElement) => converte o elemento do navegador pra um HTML 
        // Através disso tem acesso a propriedade .validationMessage. Ela retorna a mensagem que o navegador exibiria 
        // se o campo falhasse na validação
        expect(validationMessage).toEqual('This is a required field');

    })

});

test.describe('Atualização de tarefas', () => {

    test('deve concluir uma tarefa', async ({ page, request }) => {

        const task = data.update as TaskModel;

        await deleteTaskByHelper(request, task.name);
        await postTask(request, task);

        const tasksPage: TasksPage = new TasksPage(page);

        await tasksPage.go();

        await tasksPage.toggle(task.name);
        await tasksPage.shouldHaveText(task.name);


    })

});

test.describe('Exclusão de tarefas', () => {

    test.only('deve excluir uma tarefa', async ({ page, request }) => {
        const task = data.delete as TaskModel;

        await deleteTaskByHelper(request, task.name);
        await postTask(request, task);

        const tasksPage: TasksPage = new TasksPage(page);

        await tasksPage.go();
        
        await tasksPage.remove(task.name);
        await tasksPage.shouldNotExist(task.name);
    })
})


