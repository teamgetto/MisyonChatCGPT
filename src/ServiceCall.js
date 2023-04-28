
function restServiceCall(request, response) {
    const model = {
        chatCallParameter: request,
        chatResponse: response
    };
    fetch('https://localhost:7041/api/log/addchatlog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
