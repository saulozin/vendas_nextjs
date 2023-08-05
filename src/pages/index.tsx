import Head from 'next/head'
import { Layout, Dashboard } from 'components'
import { useDashboardService } from 'app/services'
import { DashboardData } from 'app/models/dashboard'
import { RotaAutenticada } from 'components'
import { GetStaticProps } from 'next'

interface HomeProps {
  dashboard: DashboardData
}

const Home: React.FC<HomeProps> = (props: HomeProps) => {
  
  return (
    <RotaAutenticada>
      <Head>
        <title>Vendas App</title>
        <link rel="icon" href="/favicon.icon" />
      </Head>

      <Layout titulo='Dashboard'>
        <Dashboard
          produtos={props.dashboard.produtos}
          clientes={props.dashboard.clientes}
          vendas={props.dashboard.vendas}
          vendasPorMes={props.dashboard.vendasPorMes}
        />
      </Layout>
    </RotaAutenticada>
  )

}

export const getStaticProps: GetStaticProps = async (context: Object) => {

  const service = useDashboardService();

  const dashboard: DashboardData = await service.get();

  return {
    props: {
      dashboard,
    },
    revalidate: 60
  }
}

export default Home;
