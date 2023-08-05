import { useState, useEffect } from 'react'
import { Layout, Message } from 'components'
import { Input, InputMoney } from 'components'
import { useProdutoService } from 'app/services'
import { Produto } from 'app/models/produtos'
import { Alert } from 'components/common/message'
import { useRouter } from 'next/router'
import * as yup from 'yup'
import Link from 'next/link'

const msgCampoObrigatorio = "Campo Obrigatorio"

const validationSchema = yup.object().shape({
    sku: yup.string().trim().required(msgCampoObrigatorio),
    nome: yup.string().trim().required(msgCampoObrigatorio),
    preco: yup.number().required(msgCampoObrigatorio).moreThan(0, "Valor maior que 0"),
    descricao: yup.string().trim().required(msgCampoObrigatorio)
})

interface FormErros {
    sku?: string;
    nome?: string;
    preco?: string;
    descricao?: string;
}

export const CadastroProdutos: React.FC = () => {
    //Hooks - UseState para manipular os valores dos campos do formulario
    const service = useProdutoService();
    const [sku, setSku] = useState<string>('');
    const [preco, setPreco] = useState<number | string>('');
    const [nome, setNome] = useState<string>('');
    const [descricao, setDescricao] = useState<string>('');
    const [id, setId] = useState<string>();
    const [dtCadastro, setDtCadastro] = useState<string>('');
    const [messages, setMessages] = useState<Array<Alert>>([]);
    const [errors, setErrors] = useState<FormErros>({});

    //Hooks para buscar os dados no banco:
    //Busca de produto por Id
    const router = useRouter();
    const { id: queryIdEditar } = router.query;

    //Hooks para aplicar efeito no componente: param 1: Func Callback, param 2: Array de dependencia
    //useEffect( () => {}, [] )
    useEffect( () =>{

        if(queryIdEditar){
            service
            .carregarProduto(queryIdEditar)
            .then(produtoEncontrado => {
                //console.log(produtoEncontrado);
                setId(produtoEncontrado.id);
                setSku(produtoEncontrado.sku || '');
                setNome(produtoEncontrado.nome || '');
                setDescricao(produtoEncontrado.descricao || '');
                setPreco(produtoEncontrado.preco || '');
                setDtCadastro(produtoEncontrado.dtCadastro || '');
            })
        }

    }, [queryIdEditar] );

    //Funcao para manipular o envio dos dados do formulario atraves do botao Salvar
    const submit = () => {
        const produto: Produto = {
            id,
            sku,
            preco: preco as number,
            nome,
            descricao,
        }
        //console.log(produto)

        validationSchema.validate(produto).then(obj => {
            setErrors({});
            if(id){
                service
                    .atualizar(produto)
                    .then(response => {
                        setMessages([
                            {tipo: "success", texto: "Produto atualizado com sucesso"}
                        ])
                    });
            } else {
                service
                    .salvar(produto)
                    .then(produtoResposta => {
                        setId(produtoResposta.id);
                        setDtCadastro(produtoResposta.dtCadastro || '');
                        setMessages([
                            {tipo: "success", texto: "Produto cadastrado com sucesso"}
                        ])
                    });
            }

        }).catch(err => {
            const field = err.path;
            const message = err.message;

            setErrors({
                [field]: message
            })
        })

    }

    return(
        <Layout titulo="Cadastro de Produtos" mensagens={messages}>
            
            {id &&
                <div className="columns">
                    <Input columnClasses='is-half' inputId='inputId' label='Código: '
                        value={id} disabled={true} />

                    <Input columnClasses='is-half' inputId='inputDtCadastro' label='Data Cadastro: '
                        value={dtCadastro} disabled={true} />
                </div>
            }

            <div className="columns">
                <Input columnClasses='is-half' inputId='inputSku' label='SKU: *' 
                    placeholder='Digite o SKU do produto' value={sku} 
                    onChange={e => setSku(e.target.value)}
                    error={errors.sku} />

                <InputMoney columnClasses='is-half' inputId='inputPreco' label='Preço: *' 
                    placeholder='Digite o preço do produto' value={preco} 
                    onChange={e => setPreco(e.target.value)}
                    error={errors.preco} />
            </div>

            <div className="columns">
                <Input columnClasses='is-full' inputId='inputNomeProd' label='Nome: *' 
                    placeholder='Digite o nome do produto' value={nome} 
                    onChange={e => setNome(e.target.value)}
                    error={errors.nome} />
            </div>

            <div className="columns">
                <div className="field column is-full">
                    <label className="label" htmlFor="textDescricao">Descrição: </label>
                    <div className="control">
                        <textarea className="textarea" id="textDescricao" 
                            placeholder="Descrição do Produto" value={descricao}
                            onChange={e => setDescricao(e.target.value)}
                        ></textarea>
                        {errors.descricao &&
                            <p className="help is-danger">{errors.descricao}</p>
                        }
                    </div>
                </div>
            </div>

            <div className="field is-grouped">
                <div className="control">
                    <button className="button is-link" onClick={submit}>
                        { id ? "Atualizar" : "Salvar" }
                    </button>
                </div>
                <div className="control">
                    <Link href="/consultas/produtos">
                        <button className="button is-link is-light">Voltar</button>
                    </Link>
                </div>
            </div>
        </Layout>
    )
}