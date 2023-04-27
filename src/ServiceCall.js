
function restServiceCall(request, response) {
    console.log("serviceCall çalıştı {request} {response}");
    const model = {
        chatCallParameter: request,
        chatResponse: response,
        createUser: 'testUser',
        createHost: '1.1.1.1'
    };
    fetch('https://localhost:7041/api/log/addchatlog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': '0c5c83623c17478199e24b35725c42e2f4fd0733973a4a4e9d92c8164f1423221682592125'
        },
        body: JSON.stringify(model)
      })
        .then(response => {
          console.log(response.status);
          return response.json();
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error(error);
        });
}

// Kullanım örneği
export default restServiceCall;
