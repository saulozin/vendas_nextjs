import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { VendaPorMes } from 'app/models/dashboard'
import { useState, useEffect } from 'react';
import { MESES } from 'app/util/meses';

//useEffect: Utilizado para carregar informações quando a tela carrega o componente

interface DashboardProps {
    produtos?: number;
    clientes?: number;
    vendas?: number;
    vendasPorMes?: Array<VendaPorMes>;
}

export const Dashboard: React.FC<DashboardProps> = ({
    produtos, clientes, vendas, vendasPorMes,
}) => {

    const [chartData, setChartData] = useState({});

    const carregaDadosGrafico = () => {
        const labels: Array<string> | any = vendasPorMes?.map(vm => MESES[vm.mes as number - 1]);
        const valores = vendasPorMes?.map(vm => vm.valor);

        const dadosGrafico = {
            labels: labels,
            datasets: [
                {
                    label: 'Valor Mensal',
                    backgroundColor: "#42A5F5",
                    data: valores
                }
            ]
        }

        setChartData(dadosGrafico);
    }

    useEffect(carregaDadosGrafico, []);

    const produtosCardStyle = {
        background: "red",
        color: "white"
    }

    const clientesCardStyle = {
        background: "blue",
        color: "white"
    }

    const vendasCardStyle = {
        background: "green",
        color: "white"
    }

    return(
        <div className="p-fluid">
            <div className="grid">
                <div className="col">
                    <Card title="Produtos" style={produtosCardStyle}>
                        <p className="m-0">
                           {produtos}
                        </p>
                    </Card>
                </div>
                <div className="col">
                    <Card title="Clientes" style={clientesCardStyle}>
                        <p className="m-0">
                            {clientes}
                        </p>
                    </Card>
                </div>
                <div className="col">
                    <Card title="Vendas" style={vendasCardStyle}>
                        <p className="m-0">
                            {vendas}
                        </p>
                    </Card>
                </div>
            </div>
            <div className="grid">
                <div className="col">
                <Chart
                        type="bar"
                        data={chartData}
                        style={{position: 'relative', width: '80%'}}
                />
                </div>
            </div>
        </div>
    )
}
