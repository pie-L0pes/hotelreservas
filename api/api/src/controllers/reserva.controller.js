const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {

    const data = req.body;

    const item =
        await prisma.reserva.create({

            data: {

                hospede: data.hospede,

                dataEntrada:
                    new Date(data.dataEntrada),

                dataSaida:
                    new Date(data.dataSaida),

                quartoId:
                    Number(data.quartoId)

            }

        });

    res.json(item);

};

const listar = async (req, res) => {
    const lista = await prisma.reserva.findMany();

    res.json(lista).status(200).end();
};

const buscar = async (req, res) => {

    const id =
        Number(req.params.id);

    const reservas =
        await prisma.reserva.findMany({

            where: {
                quartoId: id
            },

            include: {
                quarto: true
            }

        });

    res.json(reservas);

};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;

    const item = await prisma.reserva.update({
        where: { id: Number(id) },
        data: dados
    });

    res.json(item).status(200).end();
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.reserva.delete({
        where: { id: Number(id) }
    });

    res.json(item).status(200).end();
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
}
