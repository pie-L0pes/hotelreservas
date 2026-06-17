const API = "http://localhost:3000";

let quartoSelecionado = null;

let excluirAcao = null;

function esconderTudo() {

    document
        .getElementById("telaQuartos")
        .classList.add("oculto");

    document
        .getElementById("telaReservas")
        .classList.add("oculto");

}

function mostrarQuartos() {

    esconderTudo();

    document
        .getElementById("telaQuartos")
        .classList.remove("oculto");

    listarQuartos();

}

function abrirModalQuarto() {

    document
        .getElementById("modalQuarto")
        .classList.remove("oculto");

}

function fecharModalQuarto() {

    document
        .getElementById("modalQuarto")
        .classList.add("oculto");

    document
        .getElementById("numero").value = "";

    document
        .getElementById("tipo").selectedIndex = 0;

}

function abrirModalReserva() {

    document
        .getElementById("modalReserva")
        .classList.remove("oculto");

}

function fecharModalReserva() {

    document
        .getElementById("modalReserva")
        .classList.add("oculto");

    document
        .getElementById("hospede").value = "";

    document
        .getElementById("entrada").value = "";

    document
        .getElementById("saida").value = "";

}

function abrirModalExcluir(texto, acao) {

    document
        .getElementById("textoExcluir")
        .innerText = texto;

    excluirAcao = acao;

    document
        .getElementById("modalExcluir")
        .classList.remove("oculto");

}

function fecharModalExcluir() {

    document
        .getElementById("modalExcluir")
        .classList.add("oculto");

    excluirAcao = null;

}

document
    .getElementById("confirmarExcluir")
    .onclick = () => {

        if (excluirAcao) {

            excluirAcao();

        }

        fecharModalExcluir();

    };

async function listarQuartos() {

    try {

        const resposta =
            await fetch(`${API}/quarto/listar`);

        const quartos =
            await resposta.json();

        const tabela =
            document
                .getElementById("listaQuartos");

        tabela.innerHTML = "";

        quartos.forEach(q => {

            tabela.innerHTML += `

<tr>

<td>${q.numero}</td>

<td>${q.tipo}</td>

<td>

<button
class="btn-azul"
onclick="verReservas(${q.id})">

Ver Reservas

</button>

<button
class="btn-vermelho"
onclick="confirmarExcluirQuarto(${q.id})">

Excluir

</button>

</td>

</tr>

`;

        });

    }

    catch {

        alert("Erro ao listar quartos");

    }

}

async function cadastrarQuarto() {

    const numero =
        document
            .getElementById("numero")
            .value;

    const tipo =
        document
            .getElementById("tipo")
            .value;

    if (!numero || !tipo) {

        alert("Preencha todos os campos");

        return;

    }

    await fetch(

        `${API}/quarto/cadastrar`,

        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                numero,

                tipo

            })

        }

    );

    fecharModalQuarto();

    listarQuartos();

}

function confirmarExcluirQuarto(id) {

    abrirModalExcluir(

        "Excluir este quarto?",

        () => excluirQuarto(id)

    );

}

async function excluirQuarto(id) {

    await fetch(

        `${API}/quarto/excluir/${id}`,

        {

            method: "DELETE"

        }

    );

    listarQuartos();

}

async function verReservas(id) {

    quartoSelecionado = id;

    esconderTudo();

    document
        .getElementById("telaReservas")
        .classList.remove("oculto");

    const resposta =
        await fetch(

            `${API}/reserva/buscar/${id}`

        );

    const reservas =
        await resposta.json();

    const tabela =
        document
            .getElementById("listaReservas");

    tabela.innerHTML = "";

    if (reservas.length) {

        document
            .getElementById("tituloReserva")
            .innerText =
            `Reservas do Quarto ${reservas[0].quarto.numero}`;

        document
            .getElementById("tipoReserva")
            .innerText =
            `Tipo: ${reservas[0].quarto.tipo}`;

    }

    reservas.forEach(r => {

        tabela.innerHTML += `

<tr>

<td>${r.id}</td>

<td>${r.hospede}</td>

<td>${r.dataEntrada.slice(0, 10)}</td>

<td>${r.dataSaida.slice(0, 10)}</td>

<td>

<button

class="btn-vermelho"

onclick="confirmarExcluirReserva(${r.id})">

Excluir

</button>

</td>

</tr>

`;

    });

}

async function cadastrarReserva() {

    const hospede =
        document
            .getElementById("hospede")
            .value;

    const dataEntrada =
        document
            .getElementById("entrada")
            .value;

    const dataSaida =
        document
            .getElementById("saida")
            .value;

    if (

        !hospede ||

        !dataEntrada ||

        !dataSaida

    ) {

        alert(

            "Preencha todos os campos"

        );

        return;

    }

    await fetch(

        `${API}/reserva/cadastrar`,

        {

            method: "POST",

            headers: {

                "Content-Type":

                    "application/json"

            },

            body: JSON.stringify({

                hospede,

                dataEntrada,

                dataSaida,

                quartoId:

                    quartoSelecionado

            })

        }

    );

    fecharModalReserva();

    verReservas(

        quartoSelecionado

    );

}

function confirmarExcluirReserva(id) {

    abrirModalExcluir(

        "Excluir esta reserva?",

        () => excluirReserva(id)

    );

}

async function excluirReserva(id) {

    await fetch(

        `${API}/reserva/excluir/${id}`,

        {

            method: "DELETE"

        }

    );

    verReservas(

        quartoSelecionado

    );

}

mostrarQuartos();
