interface MensagemProps {
    mensagem: string
}

const Mensagem: React.FC<MensagemProps> = (props: MensagemProps) => {
    return(
        <div>
            <h1>{props.mensagem}</h1>
        </div>
    )
}

const MeuComponente = () => {
    return (
        <div>
            <Mensagem mensagem="Meu primeiro componente!" />
        </div>
    )
}

export default MeuComponente;