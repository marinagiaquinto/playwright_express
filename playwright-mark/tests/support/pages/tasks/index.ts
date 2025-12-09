
import { Page, Locator, expect } from '@playwright/test';
import { TaskModel } from '../fixtures/task.model';



export class TasksPage {

    readonly page: Page;
    // readonly - propriedade somente de leitura
    // page = nome da propriedade
    // Page = tipo da propriedade (passar o mouse em cima da propriedade para ver o tipo)
    readonly inputTaskName: Locator;
    //importar o objeto Locator


    constructor(page: Page) {
        this.page = page;
        this.inputTaskName = page.locator('input[class*="_listInputNewTask"]');
        //o elemento vira uma propriedade da classe, ficando aberto a diversas funções

    }
    //O construtor (constructor) é um método especial que é chamado automaticamente sempre que você cria 
    // uma nova instância (ou objeto) daquela classe.
    // A principal função do construtor no seu código é receber o objeto Page do Playwright e atribuí-lo 
    // a uma propriedade da sua classe, para que os outros métodos (como o created()) possam usá-lo.
    // this.page, acessa o contexto page do teste pela propriedade a qual foi atribuída no construtor.


    async go() {
        await this.page.goto('http://localhost:3000');
    }


    async created(task: TaskModel) {

        await this.inputTaskName.fill(task.name); // => massa de teste fixa
        //await inputTaskName.fill(faker.lorem.sentence()); => massa de teste dinâmica

        await this.page.click('css=button >> text=Create');
        // await page.click('xpath=//button[contains(text(),"Create")]')
        // await page.click('button[type="submit"]')
        // await inputTaskName.press('Enter'); => simula o teclado, pressionando enter para submeter o formulário
    }

    async shouldHaveText(taskName: string) {
        const target = this.page.locator(`css=.task-item p >> text=${taskName}`); // localizador do p depois da classe task-item com um nome específico
        await expect(target).toBeVisible();
    }


    async alertHaveText(text: string) {
        const target = this.page.locator('.swal2-html-container');
        await expect(target).toHaveText(text);
    }

    async toggle(taskName: string) {
        const target = this.page.locator(`xpath=//p[text()="${taskName}"]/..//button[contains(@class, "Toggle")]`)
        //Xpath -> /.. vai pro elemento pai
        //pega o texto do campo, vai pro pai e desce pro botão dele que contenha toggle como classe
        await target.click();
    }

    async shouldBeDone(taskName: string) {
        const target = this.page.getByText(taskName);
        await expect(target).toHaveCSS('text-decoration-line', 'line-through');
    }

    async remove(taskName: string) {
        const target = this.page.locator(`//p[text()="${taskName}"]/..//button[contains(@class, "Delete")]`)
        await target.click();
    }

    async shouldNotExist(taskName: string) {
        const target = this.page.getByText(taskName);
        await expect(target).not.toBeVisible();
    }

}