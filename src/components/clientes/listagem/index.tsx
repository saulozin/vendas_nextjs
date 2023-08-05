import { Cliente } from 'app/models/clientes';
import { Layout } from 'components';
import { Input, InputCpf } from 'components';
import { useFormik } from 'formik';
import { useState } from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Page } from 'app/models/common/page';
import { useClienteService } from 'app/services';
import Router from 'next/router';

interface ConsultaClientesForm {
    nome?: string;
    cpf?: string;
}

export const ListagemClientes: React.FC = () => {

    const service = useClienteService();

    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [clientes, setClientes] = useState<Page<Cliente>>({
        content: [],
        first: 0,
        number: 0,
        size: 10,
        totalElements: 0
    });

    const handleSubmit = (filtro: ConsultaClientesForm) => {
        handlePage({first: 0, rows: 10,});
    }

    const formik = useFormik<ConsultaClientesForm>({
        onSubmit: handleSubmit,
        initialValues: {
            nome: '',
            cpf: '',
        }
    })

    const handlePage = (event: DataTablePageEvent) => {
        setLoading(true);
        service.find(formik.values.nome, formik.values.cpf, event?.page, event?.rows)
            .then(result => {
                setClientes({...result, first: event?.first,});
            }).finally(() => setLoading(false));
    }

    const deletar = (cliente: Cliente) => {
        service
            .deletar(cliente.id)
            .then(result => {
                handlePage({first: 0, rows: 10,});
            });
    }

    const actionTemplate = (registro: Cliente) => {
        const url = `/cadastros/clientes?id=${registro.id}`;

        return(
            <div>
                <Button
                    label="Editar"
                    className="p-button-rounded p-button-info"
                    onClick={ e => {
                        Router.push(url);
                    }}
                />     
                
                <Button
                    label="Deletar"
                    className="p-button-rounded p-button-danger"
                    onClick={event => setDialogVisible(true)}
                />
                
                <ConfirmDialog
                    visible={dialogVisible} // Mostra o diálogo baseado no estado
                    onHide={() => setDialogVisible(false)} // Hide the dialog when the user clicks outside
                    header="Confirmação"
                    message="Confirma a exclusão?"
                    acceptLabel="Sim"
                    rejectLabel="Não"
                    accept={() => {
                        deletar(registro);
                        setDialogVisible(false); // Hide the dialog after deletion
                    }}
                />

            </div>
        )
    }

    return(
        <Layout titulo="Clientes">
            <form onSubmit={formik.handleSubmit}>
                <div className='columns'>
                    <Input label="Nome:" inputId="nome" name="nome" autoComplete="off"
                        value={formik.values.nome} onChange={formik.handleChange} columnClasses="is-half" />

                    <InputCpf label="CPF:" inputId="cpf" name="cpf" autoComplete="off" placeholder="999.999.999-99"
                        value={formik.values.cpf} onChange={formik.handleChange} columnClasses="is-half" />
                </div>

                <div className="field is-grouped">
                    <div className="control">
                        <button type="submit" className="button is-success">
                            Consultar
                        </button>
                    </div>

                    <div className="control">
                        <button type="submit" onClick={e => {Router.push("/cadastros/clientes")}} className="button is-link">
                            Novo
                        </button>
                    </div>
                </div>
            </form>
            <br/>
            <div className="columns">
                <div className="is-full">
                    <DataTable value={clientes.content} 
                        totalRecords={clientes.totalElements}
                        lazy
                        paginator
                        first={clientes.first}
                        rows={clientes.size}
                        onPage={handlePage}
                        loading={loading}
                        emptyMessage="Nenhum Registro."
                    >
                        <Column field="id" header="Código" />
                        <Column field="nome" header="Nome" />
                        <Column field="cpf" header="CPF" />
                        <Column field="email" header="Email" />
                        <Column body={actionTemplate} />
                    </DataTable>
                </div>
            </div>
        </Layout>
    )
}