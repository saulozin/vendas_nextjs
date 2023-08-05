import * as Yup from 'yup'

export const validationScheme = Yup.object().shape({
    cliente: Yup.object().nullable().required("Campo obrigatório."),
    itens: Yup.array().min(1, "Você deve adicionar pelo menos um item."),
    formaPagamento: Yup.string().trim().required("Campo obrigatório."),
});