getTodos();

	document.getElementById('todoForm').addEventListener('keydown', function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
	  		var newTodo  = document.getElementById("textInput").value;
	  		postTodo(newTodo, function(){
				getTodos();
			});
	  	}
	}) 

	document.getElementById('taskButton').addEventListener('click', function(event) {
			event.preventDefault();
	  		var newTodo  = document.getElementById("textInput").value;
	  		postTodo(newTodo, function(){
				getTodos();
			});
	})

function completeTodo(id){
	var updateTask = {};

	fetch('http://localhost:3000/todos/' + id)
	.then(function(response){
		return response.json();
	})
	.then(function(myJson){
		console.log(myJson);
		updateTask = {
			title: myJson.title,
			isCompleted: myJson.isCompleted
		}
	})
	.then(function(){
		fetch('http://localhost:3000/todos/' + id, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			isCompleted: updateTask.isCompleted ? false : true
		})
		})
	})
	.then(function(){
		clearList();
	})
}

function clearList(){
	var list = document.getElementById("unordered-list");
   		for(x = list.childNodes.length; x > 0; x--) {
      		list.removeChild(list.firstChild);
   		}
   		getTodos();
}	

function deleteTodo(clickedId){
	//clearList();
	//console.log(clickedId);
	fetch('http://localhost:3000/todos/' + clickedId, {
		method: 'delete',
	})
		.then(function(){
			clearList(function(){
				getTodos();
			});
		});
}

function getTodos(){
	document.getElementById("textInput").value = "";
	fetch('http://localhost:3000/todos')
  	.then(function(response) {
    	return response.json();
  })
  .then(function(myJson) {
    //console.log(JSON.stringify(myJson));
    for(x = 0; x < myJson.length; x++){
    	var li = document.createElement("LI");
    	var btnDelete = document.createElement("BUTTON");
    	btnDelete.setAttribute("id", myJson[x].id);
    	btnDelete.setAttribute('class', 'btn');
    	btnDelete.setAttribute('onclick', 'deleteTodo(this.id)');
    	li.setAttribute("class", "editTodo");
    	li.setAttribute('id', myJson[x].id);
    	li.setAttribute('onclick', 'completeTodo(this.id)');
		var todoText = document.createTextNode(myJson[x].title);
		li.appendChild(todoText);
		btnDelete.innerHTML = "DELETE";
    	document.getElementById("unordered-list").appendChild(li);
    	document.getElementById("unordered-list").appendChild(btnDelete);
    	if(myJson[x].isCompleted){
    		li.setAttribute("style", "text-decoration:line-through; color:green;")
    	} else {
    		li.removeAttribute("style");
    	}
    }
  });
}

function postTodo(task){
	var newTask = {
		title: task,
		isCompleted: false
	}

	var newTodo = todo => {
		var options = {
			method: 'POST',
			body: JSON.stringify(newTask),
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		}
	
		return fetch('http://localhost:3000/todos', options)
		.then(function(response){
			//do something here
			//console.log(response);
			// Clear DOM children before showing updated list of todos
			var domElement = document.getElementById("unordered-list");
			while (domElement.firstChild) {
    			domElement.removeChild(domElement.firstChild);
			}
			getTodos();
		})

	}

		newTodo(postTodo);
}