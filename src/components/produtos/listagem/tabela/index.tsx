import { Produto } from 'app/models/produtos'
import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';

interface TabelaProdutosProps {
    produtos: Array<Produto>;
    onEdit: (produto: Produto) => void;
    onDelete: (produto: Produto) => void;
}

export const TabelaProdutos: React.FC<TabelaProdutosProps> = ({
    produtos, onEdit, onDelete,
}) => {

    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);

    const actionTemplate = (registro: Produto) => {
        //const url = `/cadastros/produtos?id=${registro.id}`;

        return(
            <div>
                <Button
                    label="Editar"
                    className="p-button-rounded p-button-info"
                    onClick={ e => {
                        onEdit(registro);
                        //Router.push(url);
                    }}
                />     
                
                <Button
                    label="Deletar"
                    className="p-button-rounded p-button-danger"
                    onClick={event => {
                        setDialogVisible(true);
                        setSelectedProduto(registro);
                    }}
                />
                
                <ConfirmDialog
                    visible={dialogVisible}
                    onHide={() => setDialogVisible(false)}
                    header="Confirmação"
                    message="Confirma a exclusão do produto?"
                    acceptLabel="Sim"
                    rejectLabel="Não"
                    accept={() => {
                        if (selectedProduto) {
                            onDelete(selectedProduto);
                        }
                        setDialogVisible(false);
                    }}
                />

            </div>
        )
    }

    return(
        <DataTable value={produtos} paginator rows={10} >
            <Column field="id" header="Código" />
            <Column field="sku" header="SKU" />
            <Column field="nome" header="Nome" />
            <Column field="preco" header="Preço" />
            <Column header="" body={actionTemplate} />
        </DataTable>
    )
}