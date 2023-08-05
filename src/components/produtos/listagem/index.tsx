import { Layout, Loader } from 'components'
import { TabelaProdutos } from './tabela'
import { Produto } from 'app/models/produtos'
import { httpClient } from 'app/http'
import { AxiosResponse } from 'axios'
import { useProdutoService } from 'app/services'
import Link from 'next/link'
import Router from 'next/router'
import useSWR from 'swr'
import { useState, useEffect } from 'react'
import { Alert } from 'components/common/message'


const produtos: Produto[] = []

export const ListagemProdutos: React.FC = () => {

    const service = useProdutoService();
    const [messages, setMessages] = useState<Array<Alert>>([]);
    const { data: result, error } = useSWR<AxiosResponse<Produto[]>>('api/produtos', url => httpClient.get(url));
    const [lista, setLista] = useState<Produto[]>([]);

    useEffect( () => {
        setLista(result?.data || []);
    }, [result] );

    const editar = (produto: Produto) => {
        const urlEditar = `/cadastros/produtos?id=${produto.id}`;
        Router.push(urlEditar);
    }

    const deletar = (produto: Produto) => {
        service
            .deletar(produto.id)
            .then(response => {
                setMessages([
                    { tipo: "success", texto: "Produto removido com sucesso!" }
                ]);
                const listaAlterada: Produto[] = lista?.filter(p => p.id !== produto.id);
                setLista(listaAlterada);
            })
    }

    return(
        <Layout titulo="Lista de Produtos" mensagens={messages}>
            <Link href="/cadastros/produtos">
                <button className="button is-link">Novo</button>
            </Link>
            <br/><br/>
            <Loader show={!result} />
            <TabelaProdutos onEdit={editar} onDelete={deletar} produtos={lista} />
        </Layout>
    )
}