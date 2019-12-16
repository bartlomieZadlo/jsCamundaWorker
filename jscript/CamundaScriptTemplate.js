const { Client, logger, Variables } = require('camunda-external-task-client-js');
// Variables are requiared if you want to set new variables or change values 
// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
//  - 'asyncResponseTimeout': long polling timeout (then a new request will be issued)
const config = { baseUrl: 'http://localhost:8080/engine-rest', use: logger, asyncResponseTimeout: 10000 };

// create a Client instance with custom configuration
const client = new Client(config);

// susbscribe to the topic: 'charge-card'
client.subscribe('charge-card', async function({ task, taskService }) {
  // Put your business logic here

  // Get a process variable - output 'value'
  const amount = task.variables.get('amount');
  // Get a process variable - output { value: 'value', type: "type", valueInfo: {} }
  const item = task.variables.getTyped('item');

  // Set a process variable
  // create new variable container
  var newVariables = new Variables();
  // set variable/create new if not exists
  newVariables.set('key', 'value');
  // set multiple variables
  newVariables.setAll({
      key : 'value',
      key : 'value'
  });
  // set variable with certain type
  newVariables.setTyped('key', 'type', 'value');
 // set multiple variables with certain type
  newVariables.setAllTyped({
    key : {value: 'value', type: 'type', valueInfo: {}},
    key : {value: 'value', type: 'type', valueInfo: {}}    
  }); 

  // Complete the task
  await taskService.complete(task);
  // Complete the task with variables
  await taskService.complete(task, newVariables);  
});