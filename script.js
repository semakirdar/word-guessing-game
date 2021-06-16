let login = document.getElementById('login');
let playButton = document.getElementById('playButton');
let game = document.getElementById('game');
let gameClose = document.getElementById('gameClose');
let inputUserName = document.getElementById('inputUserName');
let gameTimer = document.getElementById('gameTimer');
let sendButton = document.getElementById('sendButton');
let inputMessage = document.getElementById('inputMessage');
let messages = document.getElementById('messages');
let contentBox = document.getElementById('contentBox');
let content = document.getElementById('content');
let notification = document.getElementById('notification');
let modal = document.getElementById('modal');
let btnOpenModal = document.getElementById('btnOpenModal');
let loginAvatar = document.getElementById('loginAvatar');
let avatars = document.querySelectorAll('.avatar');
let selectedAvatar;

//oyunu başlatmak - join (username)
// mesaj göndermek - sendMessage
//oyun başlıyor bilgisi - gameStarting (second  geliyor)
//oyun başladı - gameStarted
// yeni kelime seçildi - newWord (totalLength, openLetterCount, openLetters(index, letter))
// harf yardımı - letter (index, letter)
// mesaj geldi - message (user(username), message)
//ws://192.168.1.3:3000

let socket = io('ws://192.168.1.3:3000');

playButton.addEventListener('click', function () {
    let userName = inputUserName.value;
    login.style.display = 'none';
    game.style.display = 'block';


    socket.emit('join', {
        username: userName,
        avatar: selectedAvatar
    });
});

socket.on('gameStarting', function (data) {
    gameTimer.innerHTML = data.second;
    console.log('gameStarting', data);
});

socket.on('gameStarted', function () {
    gameTimer.innerHTML = ' ';
    console.log('gameStarted');
});

gameClose.addEventListener('click', function () {
    login.style.display = 'block';
    game.style.display = 'none';
});

sendButton.addEventListener('click', function () {
    let message = inputMessage.value;

    if(message.length>0){
        socket.emit('sendMessage', message);
        inputMessage.value = '';
        modal.style.display = 'none';
    }
    else{
        alert('lütfen bir şey gir..!!!');
    }

});

socket.on('message', function (data) {

    let messageItem = document.createElement('div');
    let messageUser = document.createElement('div');
    let message = document.createElement('div');

    messageUser.innerHTML = data.user.username;
    message.innerHTML = data.message;

    messageItem.appendChild(messageUser);
    messageItem.appendChild(message);

    messages.appendChild(messageItem);

    messageItem.classList.add('message-item');
    messageUser.classList.add('message-user');
});

socket.on('newWord', function (data) {

    console.log('newWord', data);
    contentBox.innerHTML = '';
    for (let i = 0; i < data.totalLength; i++) {
        let box = document.createElement('div');
        box.classList.add('box');
        data.openLetters.forEach(function (item, j) {
            if (i == item.index) {
                box.innerHTML = item.letter;
            }
        });
        contentBox.appendChild(box);
    }
});

// harf yardımı - letter (index, letter)

socket.on('letter', function (data) {
    let boxes = document.querySelectorAll('.box');
    boxes.forEach(function (item, i) {
        if (i == data.index) {
            item.innerHTML = data.letter;
        }

    });
});

socket.on('notification', function (data) {

    let notificationInfo = document.createElement('div');
    let notificationContent = document.createElement('div');

    notification.style.display = 'block';
    notificationInfo.innerHTML = data.title;
    notificationContent.innerHTML = data.description;
    setTimeout(function () {
        notificationContent.innerHTML = '';
        notificationInfo.innerHTML = '';
        notification.style.display = 'none';
    }, 3000);

    notification.appendChild(notificationContent);
    notification.appendChild(notificationInfo);

});

btnOpenModal.addEventListener('click', function () {
    if (modal.style.display == 'block') {
        modal.style.display = 'none';
        messages.style.display = 'block';
    } else {
        modal.style.display = 'block';
        messages.style.display = 'none';
    }
});

socket.on('users', function (data) {
    modal.innerHTML = '';
    data.forEach(function (item, i) {
        let userItem = document.createElement('div');
        let userItemImg = document.createElement('img');
        let userItemName = document.createElement('div');

        userItemImg.src = item.avatar;
        userItemName.innerHTML = item.username;

        userItem.classList.add('userItem');

        userItem.appendChild(userItemImg);
        userItem.appendChild(userItemName);

        modal.appendChild(userItem);
    });
});

avatars.forEach(function(item, i){
    item.addEventListener('click', function(e){
        selectedAvatar = this.dataset.target;

        avatars.forEach(function (item2, i2){
           item2.classList.remove('selected');
        });

        item.classList.add('selected');
    });
});