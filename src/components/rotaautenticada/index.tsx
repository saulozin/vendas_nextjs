import styles from './styles.module.css';
import { useSession, signIn } from "next-auth/react";
import { Button } from 'primereact/button';

interface RotaAutenticadaProps {
    children: React.ReactNode;
}

export const RotaAutenticada: React.FC<RotaAutenticadaProps> = ({
    children,
}) => {

    const { data: session, status } = useSession();

    //console.log(session);

    if (!session) {
        return(
            <div className={styles.content}>
                <p>
                    Você não está logado. Clique no botão para realizar o Login.
                </p><br/>
                <Button label="Sign In" className="p-button-rounded p-button-info" onClick={() => signIn("Google")} />
            </div> 
        )
    }

    return <div>{children}</div>;
}