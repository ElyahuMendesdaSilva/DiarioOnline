import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { GoogleAuthProvider, signInWithPopup, getAuth, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { get, getDatabase, ref as dbRef, set as dbSet } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCX3r37GAHv8pGKSQfGp_dLUsLl21wMHqA",
    authDomain: "amaral9c.firebaseapp.com",
    projectId: "amaral9c",
    databaseURL: "https://amaral9c-default-rtdb.firebaseio.com/",
    storageBucket: "amaral9c.appspot.com",
    messagingSenderId: "746877020688",
    storageBucket: "gs://amaral9c.appspot.com",
    appId: "1:746877020688:web:0a67d9bab9d0dc2c3e7895"
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider(app);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);

let ButtonLogin = document.querySelector(".signin");
let ButtonCreateUser = document.querySelector(".button")

if (ButtonLogin) {
    ButtonLogin.addEventListener("click", ev => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                var user = result.user;
                const LocalDeBusca = dbRef(database, "usuarios/" + user.uid);

                get(LocalDeBusca)
                    .then(snapshot => {
                        if (snapshot.exists()) {
                            console.log("O usuário já está registrado no banco de dados.");
                            localStorage.setItem("token",user.uid)
                            window.location.href = "Home/Home.html"
                        } else {
                            console.log("O usuário ainda não está registrado no banco de dados.");
                        }
                    })
                    .catch(error => {
                        console.error("Erro ao verificar a existência do usuário:", error);
                    });

            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    });
}

function Home() {
    const Lista = document.querySelector(".list")
    const CaminhoDasImagens = dbRef(database, "Imagens/");
    get(CaminhoDasImagens).then(snapshot => {
        let data = snapshot.val();
        // Verifica se data não é nulo e se é um objeto
        if (data && typeof data === 'object') {
            // Converte o objeto em um array de valores
            let dataArray = Object.values(data);
            dataArray.forEach(element => {
                let img = document.createElement("img");
                img.src = element.img;
                img.id = element.ID;
                img.classList.add("imgcardlist")
                Lista.appendChild(img)
            });
        }

        function ProcurarInformation(id) {
            const Local = dbRef(database, "Imagens/" + id)
            get(Local).then(snapshot => {
                let data = snapshot.val();
                console.log(data)
                VisualizarInformaçoes(data)
            })
        }

        function VisualizarInformaçoes(Data) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Adiciona uma animação suave à rolagem
              });
            document.querySelector(".bkg").style.display = "flex"
            //document.querySelector("body").style.overflow = 'hidden';
            document.querySelector(".user-select-img").src = Data.img;
            document.querySelector(".Comentario").innerHTML = ""
            document.querySelector(".Comentario").innerHTML = Data.Comentario
            if(Data.nivel == 1){
                document.querySelector("#star1").checked = true
            }else if(Data.nivel == 2){
                document.querySelector("#star2").checked = true
            }else if(Data.nivel == 3){
                document.querySelector("#star3").checked = true
            }else if(Data.nivel == 4){
                document.querySelector("#star4").checked = true
            }else if(Data.nivel == 5){
                document.querySelector("#star5").checked = true
            }
        }

        document.querySelector(".button").addEventListener("click",ev=>{
            document.querySelector(".bkg").style.display = "none"
            document.querySelector("body").style.overflow = 'auto';
        })

        document.querySelectorAll(".imgcardlist").forEach(element => {
            element.addEventListener("click", ev => {
                ProcurarInformation(element.id)
            });
        });
    });
}


if (window.location.href.includes("Home/Home.html")) {
    let key =  localStorage.getItem("token");
    if(!key){
        window.location.href = "../index.html"
        alert("Você não esta logado")
    }else{
        const Caminho = dbRef(database,"usuarios/"+key)
        get(Caminho)
                    .then(snapshot => {
                        if (snapshot.exists()) {
                            Home()
                        } else {
                            window.location.href = "../index.html"
                            alert("Você não esta logado")
                        }
                    })
                    .catch(error => {
                        alert("Erro")
                    });
    }
}
