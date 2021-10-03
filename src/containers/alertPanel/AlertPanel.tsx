import ErrorBlock from '../../components/errorBlock/ErrorBlock';
import { useAppSelector } from '../../lib/hooks';
import './AlertPanel.css';

export default function AlertPanel() {

    const errors = useAppSelector(state => state.session.errors);    

    return (
        <div id="alert-panel">
            {errors.map((error) => (
                <ErrorBlock key={error.id} error={error}/>
            ))}
        </div>
    );
}