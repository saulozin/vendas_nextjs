import { Layout } from "components";
import { useFormik } from "formik";
import { Page } from 'app/models/common/page'
import { Cliente } from "app/models/clientes";
import { Button } from 'primereact/button'
import { InputDate } from 'components'
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from 'primereact/autocomplete'
import { useState } from "react";
import { useClienteService, useVendaService } from 'app/services'

interface RelatorioVendasForm {
    cliente: Cliente | any;
    dataInicio: string;
    dataFim: string;
}

export const RelatorioVendas: React.FC = () => {

    const clienteService = useClienteService();
    const vendaService = useVendaService();
    const [listaClientes, setListaClientes] = useState<Page<Cliente>>({
        content: [], first: 0, number: 0, size: 20, totalElements: 0
    });

    const handleSubmit = (formData: RelatorioVendasForm) => {
        console.log(formData);
        vendaService.gerarRelatorioVendas(formData.cliente?.id, formData.dataInicio, formData.dataFim)
            .then(blob => {
                const fileURL = URL.createObjectURL(blob); //Cria uma url virtual para o arquivo
                window.open(fileURL); //Abre o arquivo no browser
            });
    }

    const formik = useFormik<RelatorioVendasForm>({
        onSubmit: handleSubmit,
        initialValues: { cliente: null, dataFim: '', dataInicio: '' }
    })

    const handleClienteAutoComplete = (e: AutoCompleteCompleteEvent) => {
        const nome = e.query;
        clienteService
            .find(nome, '', 0, 20)
            .then(clientes => setListaClientes(clientes));
    }

    return(
        <Layout titulo="Relatório de Vendas">
            <form onSubmit={formik.handleSubmit}>
                <div className="p-fluid">
                    <div className="grid">
                        <div className="col-12">
                            <label>Cliente:</label><br/>
                            <AutoComplete
                                suggestions={listaClientes.content}
                                completeMethod={handleClienteAutoComplete}
                                value={formik.values.cliente}
                                field="nome"
                                id="cliente"
                                name="cliente"
                                onChange={(e: AutoCompleteChangeEvent) => {
                                    formik.setFieldValue("cliente", e.value);
                                }}
                            />
                        </div>
                        <div className="col-6">
                            <InputDate
                                label="Data Inicio"
                                id="dataInicio"
                                name="dataInicio"
                                value={formik.values.dataInicio}
                                onChange={formik.handleChange}
                                placeholder="dd/MM/yyyy"
                            />
                        </div>
                        <div className="col-6">
                            <InputDate
                                label="Data Fim"
                                id="dataFim"
                                name="dataFim"
                                value={formik.values.dataFim}
                                onChange={formik.handleChange}
                                placeholder="dd/MM/yyyy"
                            />
                        </div>
                        <div className="col">
                            <Button label="Gerar Relatório" type="submit" />
                        </div>
                    </div>
                </div>
            </form>
        </Layout>
    );
}