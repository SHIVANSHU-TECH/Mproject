class Chatbox{
   constructor(){
    this.args = {
        openButton: document.querySelector('.chatbox__button'),
        chatbox: document.querySelector('.chatbox__support'),
        sendButton: document.querySelector('.send__button')
    }

    this.state =false;
    this.messages = [];
   }

   display(){
    const { openButton, chatbox, sendButton } = this.args;
    openButton.addEventListener('click', () =>this.toggleState(chatbox))

    sendButton.addEventListener('click', () =>this.onSendButton(chatbox))

    const node = chatbox.querySelector('input');
    node.addEventListener("keyup",({key})=>{
        if(key ==="Enter"){
            this.onSendButton(chatbox)
        }
    })
   }
   toggleState(chatbox) {
    this.state = !this.state;

    if(this.state){
        console.log("Adding class 'chatbox--active'");
        chatbox.classList.add('chatbox--active')
    } else{
        console.log("removing class 'chatbox--active'");
        chatbox.classList.remove('chatbox--active')
    }
   }
   onSendButton(chatbox){
    var textField = chatbox.querySelector('input');
    let text1 = textField.value
    if(text1 === " "){
        return;
    }
    let msg1 = { name: "User" , message:text1 }
    this.messages.push(msg1);

    fetch( $SCRIPT_ROOT + '/predict',{
        method: 'POST' ,
        body: JSON.stringify( {message: text1 }),
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(r => r.json())
    .then(r => {
        let msg2= {name:"sam", message: r.answer };
        this.messages.push(msg2);
        this.updateChatText(chatbox)
        textField.value = ' '
    }).catch((error) => {
        console.error('Error:', error);
        this.updateChatText(chatbox)
        textField.value = ' '
    });
   }

   updateChatText(chatbox){
    var html = '';
    this.messages.slice().reverse().forEach(function (item, index) {
    let messageContent = '';
    if (item.name === "sam")
    {
        messageContent = 'Bot: ' + item.message;
        html +='<div class="messages__item messages__item--visitor">' +  messageContent + '</div>'
    }
    else
    {
        messageContent = 'User: ' + item.message;
        html +='<div class="messages__item messages__item--operator">' +  messageContent +'</div>'
    }
    });
    const chatmessage = chatbox.querySelector('.chatbox__messages');
    chatmessage.innerHTML = html;
   }
}

const chatbox = new Chatbox();
chatbox.display();