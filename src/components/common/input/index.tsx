import { formatReal } from "app/util/money";
import { InputHTMLAttributes } from "react";
//import { FormatUtils } from "@4us-dev/utils";

//const formatUtils = new FormatUtils();

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    columnClasses?: string;
    inputId?: string;
    placeholder?: string;
    error?: string,
    formatter?: (value: string) => string | any | undefined;
}

export const Input: React.FC<InputProps> = ({
    label, columnClasses, inputId, placeholder, error, formatter, onChange, ...inputProps
}: InputProps) => 
{
    const onInputChange = (event: any) => {
        const value = event.target.value;
        const name = event.target.name;

        const formattedValue = (formatter && formatter(value as string)) || value;

        onChange({
            ...event,
            target: {
                name,
                value: formattedValue
            }
        })
    }    

    return(
        <div className={`field column ${columnClasses}`}>
            <label className="label" htmlFor={inputId}>{label}</label>
            <div className="control">
                <input
                    onChange={onInputChange} 
                    className="input"  
                    id={inputId} 
                    placeholder={placeholder}
                    {...inputProps}
                />
                {error &&
                    <p className="help is-danger">{error}</p>
                }
            </div>
        </div>
    )
}

export const InputMoney: React.FC<InputProps> = (props: InputProps) => {
    return(
        <Input {...props} formatter={formatReal} />
    )
}

export const InputCpf: React.FC<InputProps> = (props: InputProps) => {
    return(
        <Input {...props} /*formatter={formatUtils.formatCPF}*/ />
    )
}

export const InputPhone: React.FC<InputProps> = (props: InputProps) => {
    return(
        <Input {...props} /*formatter={formatUtils.formatPhone}*/ />
    )
}

export const InputDate: React.FC<InputProps> = (props: InputProps) => {

    /*
    const formatDate = (value: string) => {
        if(!value) {
            return '';
        }

        const data = formatUtils.formatOnlyIntegers(value);
        const size = value.length;

        if(size <= 2){
            return data;
        }

        if(size <= 4){
            return (data.substring(0 , 2) + "/" + data.substring(2 , 2));
        }

        if(size <= 8){
            return (data.substring(0 , 2) + "/" + data.substring(2 , 2) + "/" + data.substring(4 , 2));
        }
    }
    */

    return(
        <Input {...props} maxLength={10} /*formatter={formatDate}*/ />
    )
}
