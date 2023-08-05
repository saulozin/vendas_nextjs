import { Cliente } from "app/models/clientes"
import { useFormik } from 'formik'
import { Input, InputCpf, InputPhone, InputDate } from 'components'
import Link from "next/link";
import * as Yup from 'yup'

interface ClienteFormProps {
    cliente: Cliente;
    onSubmit: (cliente: Cliente) => void;
}

const formScheme: Cliente = {
    id: '',
    nascimento: '',
    cpf: '',
    nome: '',
    email: '',
    endereco: '',
    telefone: '',
    dtCadastro: ''
}

const campoObrigatorioMensagem = 'Campo Obrigatório';

const validationScheme = Yup.object().shape({
    nascimento: Yup.string().trim().required(campoObrigatorioMensagem).length(10, "Data Inválida!"),
    cpf: Yup.string().trim().required(campoObrigatorioMensagem).length(14, "CPF Inválido!"),
    nome: Yup.string().trim().required(campoObrigatorioMensagem),
    email: Yup.string().trim().required(campoObrigatorioMensagem).email("Email Inválido!"),
    endereco: Yup.string().trim().required(campoObrigatorioMensagem),
    telefone: Yup.string().trim().required(campoObrigatorioMensagem),
});

export const ClienteForm: React.FC<ClienteFormProps> = (
    {cliente, onSubmit}
) => {

    const formik = useFormik<Cliente>({
        initialValues: {...formScheme, ...cliente},
        onSubmit,
        enableReinitialize: true,
        validationSchema: validationScheme,
    })

    return(
        <form onSubmit={formik.handleSubmit}>
            {formik.values.id &&
                <div className="columns">
                    
                    <Input 
                        inputId="id" name="id" label="Código: " columnClasses="is-half"
                        value={formik.values.id}
                        autoComplete="off" disabled
                    />

                    <Input 
                        inputId="dtCadastro" name="dtCadastro" label="Data Cadastro: " columnClasses="is-half"
                        value={formik.values.dtCadastro}
                        autoComplete="off" disabled
                    />
                    
                </div>
            }

            <div className="columns">
                <Input 
                    inputId="nome" name="nome" label="Nome: " columnClasses="is-full"
                    onChange={formik.handleChange} value={formik.values.nome}
                    autoComplete="off" error={formik.errors.nome}
                />
            </div>

            <div className="columns">
                <InputCpf 
                    inputId="cpf" name="cpf" label="CPF: " columnClasses="is-half"
                    onChange={formik.handleChange} value={formik.values.cpf}
                    autoComplete="off" error={formik.errors.cpf}
                    placeholder="999.999.999-99"
                />

                <InputDate 
                    inputId="nascimento" name="nascimento" label="Data Nascimento: " columnClasses="is-half"
                    onChange={formik.handleChange} value={formik.values.nascimento}
                    autoComplete="off" error={formik.errors.nascimento}
                    placeholder="dd/MM/yyyy"
                />
            </div>

            <div className="columns">
                <Input 
                    inputId="endereco" name="endereco" label="Endereço: " columnClasses="is-full"
                    onChange={formik.handleChange} value={formik.values.endereco}
                    autoComplete="off" error={formik.errors.endereco}
                />
            </div>

            <div className="columns">
                <Input 
                    inputId="email" name="email" label="Email: " columnClasses="is-half"
                    onChange={formik.handleChange} value={formik.values.email}
                    autoComplete="off" error={formik.errors.email}
                />

                <InputPhone
                    inputId="telefone" name="telefone" label="Telefone: " columnClasses="is-half"
                    onChange={formik.handleChange} value={formik.values.telefone}
                    autoComplete="off" error={formik.errors.telefone}
                />
            </div>

            <div className="field is-grouped">
                <div className="control">
                    <button type="submit" className="button is-link">
                        { formik.values.id ? "Atualizar" : "Salvar" }
                    </button>
                </div>
                <div className="control">
                    <Link href="/consultas/clientes">
                        <button className="button is-link is-light">Voltar</button>
                    </Link>
                </div>
            </div>
        </form>
    )
}