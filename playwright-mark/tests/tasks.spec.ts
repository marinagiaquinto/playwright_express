import { expect, test } from '@playwright/test';
import { TaskModel } from './fixtures/task.model';
import { deleteTaskByHelper, postTask } from './support/helpers';
import { TasksPage } from './support/pages/tasks/index';
import data from './fixtures/tasks.json';

let tasksPage: TasksPage; 

test.beforeEach(({ page }) => {
    tasksPage = new TasksPage(page);
});

test.describe('Cadastro de tarefas', () => {

    test('deve poder cadastraruma nova tarefa', async ({ request }) => {

        const task = data.sucess as TaskModel;

        await deleteTaskByHelper(request, task.name);

        await tasksPage.go();
        await tasksPage.created(task);
        await tasksPage.shouldHaveText(task.name);


    });

    test('não deve permiti tarefa duplicada', async ({ request }) => {

        const task = data.duplicate as TaskModel;

        await deleteTaskByHelper(request, task.name);

        await postTask(request, task);

        await tasksPage.go();
        await tasksPage.created(task);
        await tasksPage.alertHaveText('Task already exists!');

    })

    test('campo obrigatório', async () => {

        const task = data.required as TaskModel;

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

    test('deve concluir uma tarefa', async ({ request }) => {

        const task = data.update as TaskModel;

        await deleteTaskByHelper(request, task.name);
        await postTask(request, task);

        await tasksPage.go();

        await tasksPage.toggle(task.name);
        await tasksPage.shouldHaveText(task.name);


    })

});

test.describe('Exclusão de tarefas', () => {

    test('deve excluir uma tarefa', async ({ request }) => {
        const task = data.delete as TaskModel;

        await deleteTaskByHelper(request, task.name);
        await postTask(request, task);

        await tasksPage.go();
        
        await tasksPage.remove(task.name);
        await tasksPage.shouldNotExist(task.name);
    })
})


