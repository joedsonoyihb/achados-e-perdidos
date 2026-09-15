/*
========================================
ACHADOS E PERDIDOS EECCAM
SISTEMA FUNCIONAL - VERSÃO DE TESTE
========================================
*/


// ======================================
// BANCO DE DADOS LOCAL
// ======================================

const STORAGE = {
    usuario: "usuarioEECCAM",
    usuarios: "usuariosEECCAM",
    mensagens: "mensagensEECCAM",
    achados: "achadosEECCAM"
};


// Recupera os dados salvos no navegador
let usuario =
    JSON.parse(localStorage.getItem(STORAGE.usuario)) || null;

let usuarios =
    JSON.parse(localStorage.getItem(STORAGE.usuarios)) || [];

let mensagens =
    JSON.parse(localStorage.getItem(STORAGE.mensagens)) || [];

let achados =
    JSON.parse(localStorage.getItem(STORAGE.achados)) || [];


// ======================================
// SALVAR DADOS
// ======================================

function salvarTudo() {

    localStorage.setItem(
        STORAGE.usuario,
        JSON.stringify(usuario)
    );

    localStorage.setItem(
        STORAGE.usuarios,
        JSON.stringify(usuarios)
    );

    localStorage.setItem(
        STORAGE.mensagens,
        JSON.stringify(mensagens)
    );

    localStorage.setItem(
        STORAGE.achados,
        JSON.stringify(achados)
    );
}


// ======================================
// TROCAR DE PÁGINA
// ======================================

function mostrarPagina(pagina) {

    const paginas =
        document.querySelectorAll(".pagina");

    paginas.forEach(function (item) {

        item.classList.remove("ativa");

    });


    const paginaSelecionada =
        document.getElementById(pagina);


    if (!paginaSelecionada) {

        mostrarToast(
            "Página não encontrada."
        );

        return;
    }


    paginaSelecionada.classList.add("ativa");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    atualizarPerfil();

    atualizarBotoesCabecalho();


    if (pagina === "achados") {

        renderizarAchados();

    }


    if (pagina === "perfil") {

        renderizarMeusAchados();

    }


    if (pagina === "chat") {

        carregarMensagens();

    }
}


// ======================================
// ABRIR CHAMADO
// ======================================

function abrirChamado() {

    if (!usuario) {

        mostrarToast(
            "Você precisa criar uma conta ou entrar primeiro."
        );


        setTimeout(function () {

            mostrarPagina("login");

        }, 800);


        return;
    }


    mostrarPagina("chat");
}


// ======================================
// CRIAR CONTA
// ======================================

function criarConta(event) {

    event.preventDefault();


    const nome =
        document
            .getElementById("cadastroNome")
            .value
            .trim();


    const email =
        document
            .getElementById("cadastroEmail")
            .value
            .trim()
            .toLowerCase();


    const matricula =
        document
            .getElementById("cadastroMatricula")
            .value
            .trim();


    const turma =
        document
            .getElementById("cadastroTurma")
            .value
            .trim();


    const senha =
        document
            .getElementById("cadastroSenha")
            .value;


    // Verificar campos
    if (
        !nome ||
        !email ||
        !matricula ||
        !turma ||
        !senha
    ) {

        mostrarToast(
            "Preencha todos os campos."
        );

        return;
    }


    // Verificar tamanho da senha
    if (senha.length < 4) {

        mostrarToast(
            "A senha precisa ter pelo menos 4 caracteres."
        );

        return;
    }


    // Verificar se email já existe
    const emailExiste =
        usuarios.some(function (u) {

            return u.email === email;

        });


    if (emailExiste) {

        mostrarToast(
            "Este e-mail já está cadastrado."
        );

        return;
    }


    // Criar usuário
    const novoUsuario = {

        id: gerarId(),

        nome: nome,

        email: email,

        matricula: matricula,

        turma: turma,

        senha: senha

    };


    usuarios.push(novoUsuario);

    usuario = novoUsuario;


    salvarTudo();


    event.target.reset();


    mostrarToast(
        "Conta criada com sucesso!"
    );


    setTimeout(function () {

        mostrarPagina("perfil");

    }, 700);
}


// ======================================
// LOGIN
// ======================================

function fazerLogin(event) {

    event.preventDefault();


    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();


    const senha =
        document
            .getElementById("loginSenha")
            .value;


    // Procurar usuário
    const usuarioEncontrado =
        usuarios.find(function (u) {

            return (
                u.email === email &&
                u.senha === senha
            );

        });


    // Compatibilidade com versão antiga
    const contaAntiga =
        JSON.parse(
            localStorage.getItem(
                STORAGE.usuario
            )
        );


    const usuarioLegado =

        !usuarioEncontrado &&
        contaAntiga &&
        contaAntiga.email === email &&
        contaAntiga.senha === senha

            ? contaAntiga

            : null;


    // Nenhum usuário encontrado
    if (
        !usuarioEncontrado &&
        !usuarioLegado
    ) {

        mostrarToast(
            "E-mail ou senha incorretos."
        );

        return;
    }


    usuario =
        usuarioEncontrado ||
        usuarioLegado;


    // Adiciona usuário à lista caso seja antigo
    const jaExiste =
        usuarios.some(function (u) {

            return u.email === usuario.email;

        });


    if (!jaExiste) {

        usuarios.push(usuario);

    }


    salvarTudo();


    event.target.reset();


    mostrarToast(
        "Login realizado com sucesso!"
    );


    setTimeout(function () {

        mostrarPagina("perfil");

    }, 600);
}


// ======================================
// ATUALIZAR PERFIL
// ======================================

function atualizarPerfil() {

    const nomeTopo =
        document.getElementById(
            "perfilNome"
        );


    const nomeCompleto =
        document.getElementById(
            "perfilNomeCompleto"
        );


    const email =
        document.getElementById(
            "perfilEmail"
        );


    const matricula =
        document.getElementById(
            "perfilMatricula"
        );


    const turma =
        document.getElementById(
            "perfilTurma"
        );


    const dados =
        usuario || {

            nome: "Visitante",

            email: "Não informado",

            matricula: "Não informado",

            turma: "Não informado"

        };


    if (nomeTopo) {

        nomeTopo.textContent =
            dados.nome;

    }


    if (nomeCompleto) {

        nomeCompleto.textContent =
            dados.nome;

    }


    if (email) {

        email.textContent =
            dados.email;

    }


    if (matricula) {

        matricula.textContent =
            dados.matricula;

    }


    if (turma) {

        turma.textContent =
            dados.turma;

    }
}


// ======================================
// ATUALIZAR BOTÃO DE LOGIN
// ======================================

function atualizarBotoesCabecalho() {

    const botaoLogin =
        document.getElementById(
            "botaoLogin"
        );


    if (!botaoLogin) {

        return;
    }


    if (usuario) {

        botaoLogin.textContent =
            "Minha conta";


        botaoLogin.onclick =
            function () {

                mostrarPagina(
                    "perfil"
                );

            };

    } else {

        botaoLogin.textContent =
            "Entrar";


        botaoLogin.onclick =
            function () {

                mostrarPagina(
                    "login"
                );

            };

    }
}


// ======================================
// SAIR DA CONTA
// ======================================

function sairDaConta() {

    usuario = null;


    localStorage.removeItem(
        STORAGE.usuario
    );


    mostrarToast(
        "Você saiu da sua conta."
    );


    atualizarPerfil();

    atualizarBotoesCabecalho();


    setTimeout(function () {

        mostrarPagina("inicio");

    }, 500);
}


// ======================================
// ENVIAR MENSAGEM
// ======================================

function enviarMensagem(event) {

    event.preventDefault();


    if (!usuario) {

        mostrarToast(
            "Faça login para enviar mensagens."
        );

        return;
    }


    const input =
        document.getElementById(
            "mensagemInput"
        );


    if (!input) {

        return;
    }


    const texto =
        input.value.trim();


    if (!texto) {

        mostrarToast(
            "Digite uma mensagem."
        );

        return;
    }


    // Criar mensagem
    const novaMensagem = {

        id: gerarId(),

        usuarioId:
            usuario.id ||
            usuario.email,

        texto: texto,

        autor: "aluno",

        data: dataHora()

    };


    mensagens.push(
        novaMensagem
    );


    salvarTudo();


    input.value = "";


    carregarMensagens();


    // Resposta automática
    setTimeout(function () {

        const resposta = {

            id: gerarId(),

            usuarioId:
                usuario.id ||
                usuario.email,

            texto:
                "Mensagem recebida! A escola irá analisar sua solicitação e responder assim que possível.",

            autor: "escola",

            data: dataHora()

        };


        mensagens.push(
            resposta
        );


        salvarTudo();


        carregarMensagens();

    }, 1200);
}


// ======================================
// CARREGAR MENSAGENS
// ======================================

function carregarMensagens() {

    const container =
        document.getElementById(
            "mensagens"
        );


    if (!container) {

        return;
    }


    container.innerHTML = "";


    // Mensagem inicial
    const mensagemInicial =
        document.createElement("div");


    mensagemInicial.className =
        "message escola";


    mensagemInicial.innerHTML = `

        <p>
            Olá! 👋
        </p>

        <p>
            Você está falando com o setor
            de Achados e Perdidos da EECCAM.
        </p>

        <p>
            Conte-nos o que você perdeu
            ou encontrou.
        </p>

        <small>
            Sistema EECCAM
        </small>

    `;


    container.appendChild(
        mensagemInicial
    );


    // Se não estiver logado, não mostra mensagens
    if (!usuario) {

        return;
    }


    const idUsuario =
        usuario.id ||
        usuario.email;


    // Somente mensagens desse usuário
    const minhasMensagens =
        mensagens.filter(function (mensagem) {

            return (
                mensagem.usuarioId ===
                idUsuario
            );

        });


    minhasMensagens.forEach(
        function (mensagem) {

            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "message " +
                mensagem.autor;


            elemento.innerHTML = `

                <p>
                    ${escaparHTML(
                        mensagem.texto
                    )}
                </p>

                <small>
                    ${escaparHTML(
                        mensagem.data
                    )}
                </small>

            `;


            container.appendChild(
                elemento
            );

        }
    );


    container.scrollTop =
        container.scrollHeight;
}


// ======================================
// REGISTRAR OBJETO
// ======================================

function registrarAchado(event) {

    event.preventDefault();


    if (!usuario) {

        mostrarToast(
            "Entre na sua conta para cadastrar um objeto."
        );


        mostrarPagina("login");

        return;
    }


    const nome =
        document
            .getElementById(
                "objetoNome"
            )
            ?.value
            .trim();


    const categoria =
        document
            .getElementById(
                "objetoCategoria"
            )
            ?.value;


    const local =
        document
            .getElementById(
                "objetoLocal"
            )
            ?.value
            .trim();


    const descricao =
        document
            .getElementById(
                "objetoDescricao"
            )
            ?.value
            .trim();


    const tipo =
        document
            .getElementById(
                "objetoTipo"
            )
            ?.value ||
        "perdido";


    // Verificar campos
    if (
        !nome ||
        !categoria ||
        !local ||
        !descricao
    ) {

        mostrarToast(
            "Preencha todos os dados do objeto."
        );

        return;
    }


    // Criar registro
    const novoAchado = {

        id: gerarId(),

        nome: nome,

        categoria: categoria,

        local: local,

        descricao: descricao,

        tipo: tipo,

        status:
            tipo === "encontrado"
                ? "encontrado"
                : "aberto",

        usuarioId:
            usuario.id ||
            usuario.email,

        autorNome:
            usuario.nome,

        data:
            new Date().toLocaleDateString(
                "pt-BR"
            )

    };


    achados.unshift(
        novoAchado
    );


    salvarTudo();


    event.target.reset();


    mostrarToast(
        "Objeto registrado com sucesso!"
    );


    renderizarAchados();

    renderizarMeusAchados();
}


// ======================================
// MOSTRAR ACHADOS
// ======================================

function renderizarAchados() {

    const lista =
        document.getElementById(
            "listaAchados"
        );


    if (!lista) {

        return;
    }


    const campoBusca =
        document.getElementById(
            "buscaAchados"
        );


    const campoFiltro =
        document.getElementById(
            "filtroStatus"
        );


    const busca =
        campoBusca
            ? campoBusca.value
                .trim()
                .toLowerCase()
            : "";


    const filtro =
        campoFiltro
            ? campoFiltro.value
            : "todos";


    const filtrados =
        achados.filter(
            function (item) {

                const texto = (

                    item.nome +
                    " " +
                    item.categoria +
                    " " +
                    item.local +
                    " " +
                    item.descricao

                ).toLowerCase();


                const combinaBusca =
                    !busca ||
                    texto.includes(
                        busca
                    );


                const combinaStatus =
                    filtro === "todos" ||
                    item.status === filtro;


                return (
                    combinaBusca &&
                    combinaStatus
                );

            }
        );


    lista.innerHTML = "";


    // Nenhum resultado
    if (!filtrados.length) {

        lista.innerHTML = `

            <div
                class="step"
                style="grid-column:1/-1;"
            >

                <div class="step-icon">

                    <span
                        class="material-symbols-outlined"
                    >
                        search_off
                    </span>

                </div>

                <h3>
                    Nenhum objeto encontrado
                </h3>

                <p>
                    Cadastre um objeto ou
                    altere sua pesquisa.
                </p>

            </div>

        `;

        return;
    }


    // Criar cards
    filtrados.forEach(
        function (item) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "step";


            let botoes = `

                <button
                    class="btn-primary"
                    onclick="verDetalhesAchado('${item.id}')"
                >
                    Ver detalhes
                </button>

            `;


            const idUsuario =
                usuario
                    ? usuario.id ||
                      usuario.email
                    : null;


            // Botões do dono do registro
            if (
                usuario &&
                item.usuarioId === idUsuario
            ) {

                if (
                    item.status !==
                    "devolvido"
                ) {

                    botoes += `

                        <button
                            class="btn-secondary"
                            onclick="marcarDevolvido('${item.id}')"
                        >
                            Marcar devolvido
                        </button>

                    `;

                }


                botoes += `

                    <button
                        class="btn-danger"
                        onclick="excluirAchado('${item.id}')"
                    >
                        Excluir
                    </button>

                `;
            }


            card.innerHTML = `

                <div class="step-icon">

                    <span
                        class="material-symbols-outlined"
                    >
                        ${iconeCategoria(
                            item.categoria
                        )}
                    </span>

                </div>

                <h3>
                    ${escaparHTML(
                        item.nome
                    )}
                </h3>

                <p>
                    <b>Categoria:</b>
                    ${escaparHTML(
                        item.categoria
                    )}
                </p>

                <p>
                    <b>Local:</b>
                    ${escaparHTML(
                        item.local
                    )}
                </p>

                <p>
                    ${escaparHTML(
                        item.descricao
                    )}
                </p>

                <p>
                    <b>Status:</b>
                    ${textoStatus(
                        item.status
                    )}
                </p>

                <p>
                    <small>
                        Registrado em
                        ${escaparHTML(
                            item.data
                        )}
                    </small>
                </p>

                <div
                    style="
                        display:flex;
                        gap:8px;
                        flex-wrap:wrap;
                        justify-content:center;
                        margin-top:12px;
                    "
                >
                    ${botoes}
                </div>

            `;


            lista.appendChild(
                card
            );

        }
    );
}


// ======================================
// MEUS OBJETOS
// ======================================

function renderizarMeusAchados() {

    const lista =
        document.getElementById(
            "meusAchados"
        );


    if (!lista) {

        return;
    }


    lista.innerHTML = "";


    if (!usuario) {

        lista.innerHTML = `

            <div
                class="step"
                style="grid-column:1/-1;"
            >

                <h3>
                    Entre para ver seus registros
                </h3>

                <button
                    class="btn-primary"
                    onclick="mostrarPagina('login')"
                >
                    Entrar
                </button>

            </div>

        `;

        return;
    }


    const idUsuario =
        usuario.id ||
        usuario.email;


    const meus =
        achados.filter(
            function (item) {

                return (
                    item.usuarioId ===
                    idUsuario
                );

            }
        );


    if (!meus.length) {

        lista.innerHTML = `

            <div
                class="step"
                style="grid-column:1/-1;"
            >

                <h3>
                    Você ainda não registrou objetos.
                </h3>

                <p>
                    Vá em "Achados" para cadastrar
                    um objeto.
                </p>

            </div>

        `;

        return;
    }


    meus.forEach(
        function (item) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "step";


            card.innerHTML = `

                <div class="step-icon">

                    <span
                        class="material-symbols-outlined"
                    >
                        ${iconeCategoria(
                            item.categoria
                        )}
                    </span>

                </div>

                <h3>
                    ${escaparHTML(
                        item.nome
                    )}
                </h3>

                <p>
                    ${textoStatus(
                        item.status
                    )}
                </p>

                <button
                    class="btn-secondary"
                    onclick="verDetalhesAchado('${item.id}')"
                >
                    Detalhes
                </button>

            `;


            lista.appendChild(
                card
            );

        }
    );
}


// ======================================
// VER DETALHES
// ======================================

function verDetalhesAchado(id) {

    const item =
        achados.find(
            function (achado) {

                return achado.id === id;

            }
        );


    if (!item) {

        mostrarToast(
            "Objeto não encontrado."
        );

        return;
    }


    mostrarToast(

        item.nome +
        " • " +
        item.local +
        " • " +
        textoStatus(
            item.status
        )

    );
}


// ======================================
// MARCAR COMO DEVOLVIDO
// ======================================

function marcarDevolvido(id) {

    const item =
        achados.find(
            function (achado) {

                return achado.id === id;

            }
        );


    if (
        !item ||
        !usuario
    ) {

        return;
    }


    const idUsuario =
        usuario.id ||
        usuario.email;


    if (
        item.usuarioId !==
        idUsuario
    ) {

        mostrarToast(
            "Você não pode alterar este registro."
        );

        return;
    }


    item.status =
        "devolvido";


    salvarTudo();


    mostrarToast(
        "Objeto marcado como devolvido."
    );


    renderizarAchados();

    renderizarMeusAchados();
}


// ======================================
// EXCLUIR ACHADO
// ======================================

function excluirAchado(id) {

    const item =
        achados.find(
            function (achado) {

                return achado.id === id;

            }
        );


    if (
        !item ||
        !usuario
    ) {

        return;
    }


    const idUsuario =
        usuario.id ||
        usuario.email;


    if (
        item.usuarioId !==
        idUsuario
    ) {

        mostrarToast(
            "Você não pode excluir este registro."
        );

        return;
    }


    const confirmar =
        confirm(
            "Excluir o registro \"" +
            item.nome +
            "\"?"
        );


    if (!confirmar) {

        return;
    }


    achados =
        achados.filter(
            function (achado) {

                return achado.id !== id;

            }
        );


    salvarTudo();


    mostrarToast(
        "Registro excluído."
    );


    renderizarAchados();

    renderizarMeusAchados();
}


// ======================================
// NOTIFICAÇÃO
// ======================================

function mostrarToast(texto) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        return;
    }


    toast.textContent =
        texto;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );
}


// ======================================
// SEGURANÇA
// ======================================

function escaparHTML(texto) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(
            texto ?? ""
        );


    return div.innerHTML;
}


// ======================================
// GERAR ID
// ======================================

function gerarId() {

    return (

        Date.now()
            .toString(36) +

        Math.random()
            .toString(36)
            .slice(2, 8)

    );
}


// ======================================
// DATA E HORA
// ======================================

function dataHora() {

    return new Date().toLocaleString(
        "pt-BR",
        {
            dateStyle: "short",
            timeStyle: "short"
        }
    );
}


// ======================================
// STATUS
// ======================================

function textoStatus(status) {

    const statusTexto = {

        aberto:
            "🔎 Procurando dono",

        encontrado:
            "📦 Encontrado",

        devolvido:
            "✅ Devolvido"

    };


    return (
        statusTexto[status] ||
        "🔎 Procurando dono"
    );
}


// ======================================
// ÍCONE DA CATEGORIA
// ======================================

function iconeCategoria(categoria) {

    const mapa = {

        "Mochila":
            "backpack",

        "Chave":
            "key",

        "Documento":
            "badge",

        "Material escolar":
            "school",

        "Eletrônico":
            "smartphone",

        "Roupa":
            "checkroom",

        "Outro":
            "inventory_2"

    };


    return (
        mapa[categoria] ||
        "inventory_2"
    );
}


// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        atualizarPerfil();

        atualizarBotoesCabecalho();

        carregarMensagens();

        renderizarAchados();

        renderizarMeusAchados();

    }
);