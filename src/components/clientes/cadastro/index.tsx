import { useEffect } from 'react';
import { Layout } from 'components'
import { ClienteForm } from './form'
import { useState } from 'react'
import { Cliente } from 'app/models/clientes';
import { useClienteService } from 'app/services'
import { Alert } from 'components/common/message';
import { useRouter } from 'next/router';

export const CadastroClientes: React.FC = () => {

    //Hooks do Cliente
    const [cliente, setCliente] = useState<Cliente>({});
    const [messages, setMessages] = useState<Array<Alert>>([]);

    const service = useClienteService();
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if(id) {
            service.carregarCliente(id)
                .then(clienteEncontrado => {
                    setCliente(clienteEncontrado);
                });
        }
    }, [id]);

    const handleSubmit = (cliente: Cliente) => {
        //console.log(cliente);

        if(cliente.id) {
            service
                .atualizar(cliente)
                .then(response => {
                    //console.log('Cliente Atualizado!');
                    setMessages([
                        {tipo: "success", texto: "Cliente atualizado com sucesso"}
                    ])
                });
        } else {
            service
                .salvar(cliente)
                .then(clienteSalvo => {
                    setCliente(clienteSalvo);
                    //console.log('Cliente Salvo!');
                    //console.log(clienteSalvo);
                    setMessages([
                        {tipo: "success", texto: "Cliente cadastrado com sucesso"}
                    ])
                });
        }
    }

    return(
        <Layout titulo='Cadastro de Clientes' mensagens={messages} >
            <ClienteForm cliente={cliente} onSubmit={handleSubmit} />
        </Layout>
    )
}