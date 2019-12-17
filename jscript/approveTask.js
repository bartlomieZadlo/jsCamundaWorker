const { Client, logger, Variables } = require('camunda-external-task-client-js');

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
//  - 'asyncResponseTimeout': long polling timeout (then a new request will be issued)
const config = { baseUrl: 'http://localhost:8080/engine-rest', use: logger, asyncResponseTimeout: 10000 };

// create a Client instance with custom configuration
const client = new Client(config);

client.subscribe('approve-task', async function({ task, taskService }) {    
    console.log('start');
    const amount = task.variables.get('amount');
    const item = task.variables.get('item');
    const readline = require('readline');
    let approve = false;
    let failed = true;
    
    console.log(`Peyment: ${amount} $ for ${item}`);
    const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    rl.question("Are you approve? (y/n)", async (input) => {  
        let answer = input;     
        if (answer === "y") {
            approve = true;
        } else {
            approve = false;
        }
        rl.close();
        console.log(`user input finish: asnwer = ${answer}`);

        console.log(`setting process variable as ${approve}`);
        var variables = new Variables().set('approved', approve);
        console.log(task.variables.getAllTyped());
        console.log('end');
        // Complete the task
        await taskService.complete(task, variables);
        failed = false;
    }); 
    if (failed) await taskService.failed(task);
});