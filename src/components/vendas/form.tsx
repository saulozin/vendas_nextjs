import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteChangeEvent } from 'primereact/autocomplete';
import { ItemVenda, Venda } from 'app/models/vendas';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Cliente } from 'app/models/clientes';
import { Page } from 'app/models/common/page';
import { useClienteService, useProdutoService } from 'app/services';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Produto } from 'app/models/produtos';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { validationScheme } from './validationScheme'
import { format, parse } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const formatadorMoney = new Intl.NumberFormat('pt-BR', {
    style: 'currency', //R$
    currency: 'BRL',
})

interface VendasFormProps {
    onSubmit: (venda: Venda) => void;
    onNovaVenda: () => void;
    vendaRealizada: boolean;
}

const formScheme: Venda = {
    cliente: null,
    itens: [],
    total: 0,
    formaPagamento: '',
}

export const VendasForm: React.FC<VendasFormProps> = ({
    onSubmit, onNovaVenda, vendaRealizada,
}) => {

    const clienteService = useClienteService();
    const produtoService = useProdutoService();

    const formasPagamento: string[] = ["PIX", "CREDITO", "DEBITO", "BOLETO"];
    const [listaProdutos, setListaProdutos] = useState<Produto[]>([]);
    const [listaFiltradaProdutos, setListaFiltradaProdutos] = useState<Produto[]>([]);
    const [erroMessage, setErroMessage] = useState<string>('');
    const [codigoProduto, setCodigoProduto] = useState<string>('');
    const [quantidadeProduto, setQuantidadeProduto] = useState<number>(0);
    const [produto, setProduto] = useState<Produto>({nome: ''});

    const [listaClientes, setListaClientes] = useState<Page<Cliente>>({
        content: [],
        first: 0,
        number: 0,
        size: 0,
        totalElements: 0
    });

    const formik = useFormik<Venda>({
        onSubmit,
        initialValues: formScheme,
        validationSchema: validationScheme,
    });

    const handleClienteAutoComplete = (e: AutoCompleteCompleteEvent) => {
        const nome = e.query;
        clienteService
            .find(nome, '', 0, 20)
            .then(clientes => setListaClientes(clientes));
        //console.log(nome);
    }

    const handleProdutoAutoComplete = async (e: AutoCompleteCompleteEvent) => {
        const nomeProduto = e.query.toUpperCase();

        if(!listaProdutos.length) {
            //console.log("listando produtos...")
            const produtosEncontrados = await produtoService.listar();
            setListaProdutos(produtosEncontrados);                                    
        }

        const listaProdutosEncontrados = listaProdutos.filter((produto: Produto) => {
            return produto.nome?.toUpperCase().includes(nomeProduto);
        });

        setListaFiltradaProdutos(listaProdutosEncontrados);
    }

    const handleClienteEvent = (e: AutoCompleteChangeEvent) => {
        const clienteSelecionado: Cliente = e.value;
        formik.setFieldValue("cliente", clienteSelecionado);
    }

    const handleCodigoProdutoSelect = (ev: any) => {
        if(codigoProduto){
            produtoService
                .carregarProduto(codigoProduto)
                .then(produtoEncontrado => setProduto(produtoEncontrado))
                .catch(error => {

                    setErroMessage("Produto não encontrado!");
                    setCodigoProduto('');
                    setProduto({nome: ''});
                    setQuantidadeProduto(0);
                    
                });
        }
    }

    const handleAddProduto = () => {
        //console.log(produto);
        const itensAdicionados = formik.values.itens;
        const jaExisteItemNaVenda = itensAdicionados?.some((iv: ItemVenda) => {
            return iv.produto?.id === produto.id;
        });

        if(jaExisteItemNaVenda) {
            itensAdicionados?.forEach((iv: ItemVenda) => {
                if(iv.produto?.id === produto.id){
                    iv.quantidade += quantidadeProduto;
                }
            });
        } else {
            itensAdicionados?.push({
                produto: produto,
                quantidade: quantidadeProduto,
            });
        }

        setProduto({nome: ''});
        setCodigoProduto('');
        setQuantidadeProduto(0);

        const total = totalVenda();
        formik.setFieldValue("total", total);
    }

    const diseableAddProdutoButton = () => {
        return (!produto || !quantidadeProduto);
    }

    const totalVenda = () => {
        const totais: number[] | any = formik.values.itens?.map((iv: ItemVenda | any) => iv.quantidade * iv.produto.preco);
        if(totais.length){
            return totais.reduce((somatorioAtual = 0, valorItemAtual: number) => somatorioAtual + valorItemAtual);
        } else {
            return 0;
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const vendaData = { ...formik.values };

        // Verifique a data de nascimento antes da conversão
        //console.log('Data de nascimento antes da conversão:', vendaData.cliente?.nascimento);

        // Verifique o produto antes da conversão
        //console.log('Produto antes da conversão:', vendaData.itens);

        // Formatação da data de nascimento do cliente
        if (vendaData.cliente?.nascimento) {
            try {
                const parsedNascimento = parse(vendaData.cliente.nascimento, 'dd/MM/yyyy', new Date());
                vendaData.cliente.nascimento = format(parsedNascimento, 'yyyy-MM-dd');
            } catch (error) {
                console.error('Erro na conversão da data de nascimento:', error);
            }
        }

        // Formatação da data de cadastro do cliente
        if (vendaData.cliente?.dtCadastro) {
            try {
                const parsedDtCadastro = parse(vendaData.cliente.dtCadastro, 'dd/MM/yyyy', new Date());
                vendaData.cliente.dtCadastro = format(parsedDtCadastro, 'yyyy-MM-dd');
            } catch (error) {
                console.error('Erro na conversão da data de cadastro do cliente:', error);
            }
        }

        // Formatação da data de cadastro do produto
        vendaData.itens?.forEach((item: ItemVenda) => {
            if (item.produto.dtCadastro) {
                try {
                    // Convertendo a data no formato "dd/MM/yyyy HH:mm:ss" para formato ISO
                    const parsedDtCadastroProduto = parse(item.produto.dtCadastro, 'dd/MM/yyyy HH:mm:ss', new Date());
                    const zonedDtCadastroProduto = utcToZonedTime(parsedDtCadastroProduto, 'America/Manaus');
                    
                    // Convertendo a data para o formato ISO (yyyy-MM-ddTHH:mm:ssZ)
                    const formattedDtCadastroProduto = zonedDtCadastroProduto.toISOString();
                    
                    item.produto.dtCadastro = formattedDtCadastroProduto;
                } catch (error) {
                    console.error('Erro na conversão da data de cadastro do produto:', error);
                }
            }
        });
  
        // Chama a função onSubmit com os dados formatados
        onSubmit(vendaData);
    };

    const realizarNovaVenda = () => {
        onNovaVenda();
        formik.resetForm();
        formik.setFieldValue("itens", []);
        formik.setFieldTouched("itens", false);
    }

    return(
        /*<form onSubmit={formik.handleSubmit}>*/
        <form onSubmit={handleSubmit}>
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="cliente">Cliente:</label>
                    <AutoComplete 
                        suggestions={listaClientes.content}
                        completeMethod={handleClienteAutoComplete}
                        value={formik.values.cliente}
                        field="nome"
                        id="cliente" 
                        name="cliente"
                        onChange={handleClienteEvent}
                    />
                    <small className="p-invalid" >
                        {formik.touched && formik.errors.cliente}
                    </small>
                    <br />
                </div>
                <div className="grid">
                    <div className="col-2">
                        <span className="p-float-label">
                            <InputText 
                                id="codigoProduto" value={codigoProduto} 
                                onChange={(e) => setCodigoProduto(e.target.value)}
                                onBlur={handleCodigoProdutoSelect}
                            />
                            <label htmlFor="codigoProduto">Código</label>
                        </span>
                    </div>

                    <div className="col-6">
                        <AutoComplete
                            suggestions={listaFiltradaProdutos}
                            completeMethod={handleProdutoAutoComplete}
                            value={produto} 
                            field="nome"
                            id="produto"
                            name="produto"
                            onChange={e => setProduto(e.value)}
                        />
                    </div>

                    <div className="col-2">
                        <span className="p-float-label">
                            <InputText
                               id="qtdProduto" value={quantidadeProduto?.toString()}
                               onChange={(e) => setQuantidadeProduto(parseInt(e.target.value))}
                            />
                            <label htmlFor="qtdProduto">Quantidade</label>
                        </span>
                    </div>

                    <div className="col-2">
                        <Button label="Adicionar" onClick={handleAddProduto} disabled={diseableAddProdutoButton()} />
                    </div>

                    <div className='col-12'>
                        <DataTable value={formik.values.itens} emptyMessage="Nenhum Produto Adicionado.">
                            <Column body={(item: ItemVenda) => {

                                const handleRemoverItem = () => {
                                    const novaLista = formik.values.itens?.filter(
                                        iv => iv.produto.id !== item.produto.id
                                    );

                                    formik.setFieldValue("itens", novaLista);
                                }

                                return(
                                    <div>
                                        <Button type="button" label="Excluir" onClick={handleRemoverItem} />
                                    </div>
                                )
                            }} />
                            <Column header="Código" field="produto.id" />
                            <Column header="SKU" field="produto.sku" />
                            <Column header="Produto" field="produto.nome" />
                            <Column header="Preço Un" field="produto.preco" />
                            <Column header="Qtd Produto" field="quantidade" />
                            <Column header="Total" body={(iv: ItemVenda | any) => {
                                const total = iv.produto.preco * iv.quantidade
                                const totalFormatado = formatadorMoney.format(total);
                                return(
                                    <div>
                                        { totalFormatado }
                                    </div>
                                )
                            }} />
                        </DataTable>
                        <small className="p-invalid" >
                            {formik.touched && formik.errors.itens}
                        </small>
                    </div>

                    <div className='col-3'>
                        <div className='field'>
                            <label htmlFor='formaPagamento'>Forma de Pagamento:</label>
                            <Dropdown 
                                id='formaPagamento'
                                options={formasPagamento}
                                value={formik.values.formaPagamento}
                                onChange={(e) => {
                                    formik.setFieldValue("formaPagamento", e.value);
                                }}
                                placeholder='Selecione'
                            />
                            <small className="p-invalid" >
                                {formik.touched && formik.errors.formaPagamento}
                            </small>
                        </div>
                    </div>

                    <div className='col-2'>
                        <div className='field'>
                            <label htmlFor='itens'>Itens</label>
                            <InputText id='itens' disabled value={formik.values.itens?.length.toString()} />
                        </div>
                    </div>

                    <div className='col-2'>
                        <div className='field'>
                            <label htmlFor='total'>Total</label>
                            <InputText id='total' disabled value={formatadorMoney.format(formik.values.total)} />
                        </div>
                    </div>

                </div>
                <br />
                {!vendaRealizada &&
                    <Button type="submit" label="Finalizar" />
                }
                {vendaRealizada &&
                    <Button type="button" onClick={realizarNovaVenda} label="Nova Venda" severity="success" />
                }
            </div>
            <Dialog header="Atenção:" position="top" visible={!!erroMessage} onHide={() => setErroMessage('')} >
                {erroMessage}
            </Dialog>
        </form>
    );
}