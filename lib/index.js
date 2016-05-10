const toposort = require('toposort');

const tasks = {
  build: {
    requires: ['compile', 'document', 'standards'],
    task: () => console.log('Build'),
  },
  clean: {
    precedes: '*',
    task: () => console.log('Clean'),
  },
  compile: {
    task: () => console.log('Compile'),
  },
  document: {
    task: () => console.log('Document'),
  },
  rebuild: {
    requires: ['clean', 'compile', 'document', 'standards'],
    task: () => console.log('Rebuild'),
  },
  publish: {
    requires: 'rebuild',
    task: () => console.log('Publish'),
  },
  standards: {
    task: () => console.log('Standards'),
  },
};

const rootTask = tasks.publish;

const requiredMapTasks = {
};

function stringOrArray(obj) {
  if (!obj) {
    return [];
  } else if (Array.isArray(obj)) {
    return obj;
  } else {
    return [obj];
  }
}

function addRequiredTasks(currentTask) {
  if (currentTask.requires) {
    console.log('Task has requires....');
    for (const subTaskName of stringOrArray(currentTask.requires)) {
      if (!requiredMapTasks[subTaskName]) {
        console.log('Loading prerequisite: %s', subTaskName);
        const subTask = tasks[subTaskName];
        requiredMapTasks[subTaskName] = subTask;
        addRequiredTasks(subTask);
      } else {
        console.log('Already require %s', subTask);
      }
    }
  }
}

addRequiredTasks(rootTask);
console.log('Needs:');
console.log(requiredMapTasks);

// splurge clean (clean -> [compile, document, standards])
// splurge build ([compile, document, standards])
// splurge publish (clean -> [compile, document, standards] -> publish)
console.log(toposort(tasks));

