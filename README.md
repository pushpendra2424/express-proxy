terminal open and run command : node index
another terminal open and run command : node user.service
another terminal open and run command node : product.service


login :-
method : POST
endPoint : localhost:9090/login
bodyData :{username: "user1", password: "password1"}

service add :-
method : POST,
endPoint : localhost:9090/add-servic,
bodyData :{
serviceName: "", 
target: "",     url
auth:true/flase,
enabled:true/false
}
headers:-
Authorization: token



check data
method : get,
headers: token
url : localhost:9090/users

