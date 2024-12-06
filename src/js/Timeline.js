export class Timeline {
    constructor(parentElement = document.querySelector("body")) {
        this.parentElement = parentElement;
        this.board = undefined;

        this.postArr = [];

        this.createBoard()      //не менять местами методы createBoard и createTextInput иначе собъется разметка страницы
        this.createTextInput()
        this.loadPosts()
    }

    createTextInput() {
        const textInput = document.createElement("textarea");
        textInput.classList.add("textarea");
        this.parentElement.append(textInput);

        addEventListener("keydown", (event) => {
            
            if(event.key === "Enter") {
                event.preventDefault()
                const postObj = {};

                postObj.text = textInput.value;
                textInput.value = ""

                const date = new Date();
                postObj.date = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes()

                const promise = new Promise((resolve) => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            postObj.coords = "[" + position.coords.latitude + ", " + position.coords.longitude + "]";
                            resolve();
                        
                        },
                        (error) => {
                            this.createGeoDiv(postObj);
                        }

                        )
                })

                promise.then(() => {
                    this.postArr.push(postObj);
                    this.createPost(postObj);
                })
                
                
            }
        })
    }

    createBoard() {
        this.board = document.createElement("div");
        this.board.classList.add("board");
        this.parentElement.append(this.board);

        document.addEventListener("keydown", (event) => { //Очистка локального хранилища нажатием клавишы DELETE
            if (event.key === "Delete") {
                window.localStorage.clear()
            }
        })

    }

    createPost(postObj) {
        const post = document.createElement("div");
        post.classList.add("post");
        this.board.append(post);

        const text = document.createElement("div");
        text.classList.add("text");
        text.textContent = postObj.text;
        post.append(text);

        const date = document.createElement("div");
        date.classList.add("date");
        date.textContent = postObj.date;
        post.append(date);

        const coords = document.createElement("div");
        coords.classList.add("coords");
        coords.textContent = postObj.coords;
        post.append(coords);

        this.savePosts()
    }

    savePosts() {
        window.localStorage.setItem("posts", JSON.stringify(this.postArr))
    }

    loadPosts() {
        if (window.localStorage.hasOwnProperty("posts")) {
            this.postArr = JSON.parse(window.localStorage.getItem("posts"))
            this.postArr.forEach((element) => {
                this.createPost(element)
            })
        }

        
    }

    createGeoDiv(postObj) {
        const geo = document.createElement("div");
        geo.classList.add("geo");
        this.parentElement.append(geo);

        const text = document.createElement("div");
        text.classList.add("geo_text");
        text.textContent = "Что-то пошло не так.\n" + "Пожалуйства введите свои координаты вручную"
        geo.append(text);

        const input = document.createElement("input");
        input.classList.add("geo_input");
        geo.append(input);

        const okButton = document.createElement("div");
        okButton.classList.add("geo_ok_button");
        okButton.textContent = "OK"
        geo.append(okButton);

        const closeButton = document.createElement("div");
        closeButton.classList.add("geo_close_button");
        closeButton.textContent = "Close"
        geo.append(closeButton);

        closeButton.addEventListener("click", () => {
            geo.remove()
        })

        okButton.addEventListener("click", () => {
           const coordsObj = this.customCoordsInput(input);
           if (coordsObj !== undefined) {
                postObj.coords = "[" + coordsObj.latitude + ", " + coordsObj.longitude + "]";
                this.postArr.push(postObj);
                this.createPost(postObj);
                geo.remove();
            
           }
            
        })
    }

    customCoordsInput(input) {
        const condition1 = /^(\[){0,1}(\-){0,1}(\d){1,2}.\d+,(\s){0,1}(\-){0,1}(\d){1,3}.\d+(\]){0,1}$/.test(input.value);
        const condition2 = /[a-z]|[A-Z]|[А-Я]|[а-я]/.test(input.value);

        if (condition1 && !condition2) {
            input.setCustomValidity("");
            const coordsObj = {};
            const coordsString = input.value.replace(/\s/gi, "").replace(/\[/gi, "").replace(/\]/gi, "");
            const coordsArr = coordsString.split(',');

            coordsObj.latitude = coordsArr[0];
            coordsObj.longitude = coordsArr[1];
            
            
            return coordsObj
        } else {
            input.setCustomValidity("Заполните форму правильно. Пример [xx.xxx, xx.xxx]");
            input.reportValidity();
        }
    }
} 