import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import serviceCall from './ServiceCall';
import chatMainJS from './ChatMain';

const API_KEY = "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";
const forbiddenWords = ['Mısyon Yatırım Bankası', 'Misyon Yatirim Bankasi', 'Misyon yatırım bankası', 'Misyon Bank', 'Mısyon Bank'];

const regex = new RegExp(forbiddenWords.join('|'), 'gi');
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
  "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience."
}

function App() {
  let requestMessage;
  const [messages, setMessages] = useState([
    {
      message: "Merhaba, ben Misyon Chat! \n Seni gördüğüme mutlu oldum, bugün seninle ne yapalım ?",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const matches = message.match(regex);
    requestMessage = message;

    if (matches !== null) {
      chatMainJS(); 
    } else {
      const newMessage = {
        message,
        direction: 'outgoing',
        sender: "user"
      };

      const newMessages = [...messages, newMessage];
      
      setMessages(newMessages);

      // Initial system message to determine ChatGPT functionality
      // How it responds, how it talks, etc.
      setIsTyping(true);
      await processMessageToChatGPT(newMessages);
    }     
  };

  async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });


    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act. 
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // The system message DEFINES the logic of our chatGPT
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      serviceCall(requestMessage, data.choices[0].message.content);
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
    });
  }  

  return (
    <div className="App">
      <div class="row h-auto min-vh-100 bg-dark">
        <div class="col-3"></div>
        <div class = "col-6 m-3 p-3">
          <div style={{ height: "100%", }}>
            <MainContainer>
              <ChatContainer>       
                <MessageList 
                  scrollBehavior="smooth" 
                  typingIndicator={isTyping ? <TypingIndicator content="Misyon Chat yazıyor" /> : null}
                >
                  {messages.map((message, i) => {
                    console.log(message)
                    return <Message key={i} model={message} />
                  })}
                </MessageList>
                <MessageInput placeholder="Mesajınızı buraya yazın" onSend={handleSend} />        
              </ChatContainer>
            </MainContainer>
          </div>
        </div> 
      </div>          
      <div class="modal" id="myModal">
        <div class="modal-dialog">
          <div class="modal-content"> 
            <div class="modal-body">
              Genele açık yapay zeka uygulamalarını kullanırken bankamızın adının ve stratejilerinin hiçbir şekilde kullanılmaması gerekmektedir. Lütfen banka adı yerine "Ağa123" rumuzunu kullanınız.
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Kapat</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
